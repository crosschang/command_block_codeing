param(
    [switch]$Check,
    [string]$ExpectedVersion = ''
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$GeneratorVersion = '12.5.0'
if ($ExpectedVersion -and $ExpectedVersion -ne $GeneratorVersion) {
    throw "Registry generator version mismatch. Expected $ExpectedVersion but found $GeneratorVersion."
}
Write-Host "Registry generator v$GeneratorVersion"

$Root = Split-Path -Parent $PSScriptRoot
$SourceDir = Join-Path $Root 'registry\source\bedrock'
$DerivedDir = Join-Path $Root 'registry\derived\bedrock'
$OutDir = Join-Path $Root 'src\libraries'
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$FlatSpecs = @(
    [ordered]@{ Kind='items';     SourceDir=$SourceDir;  Namespace='MCFunctionItemLibrary';     Prefix='item';     ReturnType='string';                         WrapPrefix='';                         WrapSuffix=''; File='item_library.generated.ts' },
    [ordered]@{ Kind='blocks';    SourceDir=$SourceDir;  Namespace='MCFunctionBlockLibrary';    Prefix='block';    ReturnType='MCFunctionFields.BlockValue';    WrapPrefix='MCFunctionFields.block(';    WrapSuffix=')'; File='block_library.generated.ts' },
    [ordered]@{ Kind='entities';  SourceDir=$SourceDir;  Namespace='MCFunctionEntityLibrary';   Prefix='entity';   ReturnType='MCFunctionFields.EntityValue';   WrapPrefix='MCFunctionFields.entity(';   WrapSuffix=')'; File='entity_library.generated.ts' },
    [ordered]@{ Kind='effects';   SourceDir=$SourceDir;  Namespace='MCFunctionEffectLibrary';   Prefix='effect';   ReturnType='MCFunctionFields.EffectValue';   WrapPrefix='MCFunctionFields.effect(';   WrapSuffix=')'; File='effect_library.generated.ts' },
    [ordered]@{ Kind='particles'; SourceDir=$SourceDir;  Namespace='MCFunctionParticleLibrary'; Prefix='particle'; ReturnType='MCFunctionFields.ParticleValue'; WrapPrefix='MCFunctionFields.particle('; WrapSuffix=')'; File='particle_library.generated.ts' },
    [ordered]@{ Kind='families';  SourceDir=$DerivedDir; Namespace='MCFunctionFamilyLibrary';   Prefix='family';   ReturnType='string';                         WrapPrefix='';                         WrapSuffix=''; File='family_library.generated.ts' }
)

$ReservedWords = @{}
@(
    'break','case','catch','class','const','continue','debugger','default','delete','do','else','enum',
    'export','extends','false','finally','for','function','if','import','in','instanceof','new','null',
    'return','super','switch','this','throw','true','try','typeof','var','void','while','with','as',
    'implements','interface','let','package','private','protected','public','static','yield','any','boolean',
    'constructor','declare','get','module','require','number','set','string','symbol','type','from','of'
) | ForEach-Object { $ReservedWords[$_] = $true }

function Read-FlatRegistryEntries($Spec) {
    $Path = Join-Path $Spec.SourceDir ($Spec.Kind + '.json')
    if (-not (Test-Path $Path)) { throw "Registry source not found: $Path" }

    $Data = Get-Content -Raw -Encoding UTF8 $Path | ConvertFrom-Json
    $Entries = @($Data.entries)

    $Seen = @{}
    foreach ($Entry in $Entries) {
        $Id = [string]$Entry.id
        if ([string]::IsNullOrWhiteSpace($Id)) { throw "Empty id in $Path" }
        if ($Seen.ContainsKey($Id)) { throw "Duplicate id in ${Path}: $Id" }
        $Seen[$Id] = $true
    }
    return $Entries
}

function Read-GroupedRegistry([string]$Kind) {
    $Path = Join-Path $DerivedDir ($Kind + '.json')
    if (-not (Test-Path $Path)) { throw "Registry source not found: $Path" }

    $Data = Get-Content -Raw -Encoding UTF8 $Path | ConvertFrom-Json
    $Entities = @($Data.entities)

    $SeenEntity = @{}
    foreach ($EntityEntry in $Entities) {
        $EntityId = [string]$EntityEntry.entity
        if ([string]::IsNullOrWhiteSpace($EntityId)) { throw "Empty entity id in $Path" }
        if ($SeenEntity.ContainsKey($EntityId)) { throw "Duplicate entity in ${Path}: $EntityId" }
        $SeenEntity[$EntityId] = $true

        $SeenEvent = @{}
        foreach ($EventId in @($EntityEntry.events)) {
            $Value = [string]$EventId
            if ([string]::IsNullOrWhiteSpace($Value)) { throw "Empty event id for $EntityId in $Path" }
            if ($SeenEvent.ContainsKey($Value)) { throw "Duplicate event for ${EntityId} in ${Path}: $Value" }
            $SeenEvent[$Value] = $true
        }
    }
    return $Entities
}

function Get-LocalId([string]$Id) {
    if ($Id.Contains(':')) { return $Id.Substring($Id.IndexOf(':') + 1) }
    return $Id
}

function Get-CamelName([string]$Value) {
    $Local = Get-LocalId $Value
    $Parts = @([regex]::Split($Local, '[^A-Za-z0-9]+') | Where-Object { $_ })
    if ($Parts.Count -eq 0) { return 'value' }

    $Base = $Parts[0].ToLowerInvariant()
    for ($i = 1; $i -lt $Parts.Count; $i++) {
        $Part = $Parts[$i]
        if ($Part.Length -gt 0) {
            $Base += $Part.Substring(0,1).ToUpperInvariant() + $Part.Substring(1)
        }
    }

    if ($Base -match '^[0-9]') { $Base = 'id' + $Base }
    if ($ReservedWords.ContainsKey($Base)) { $Base += 'Value' }
    return $Base
}

function Get-FunctionName($Entry) {
    $Explicit = $null
    if ($Entry.PSObject.Properties.Name -contains 'functionName') {
        $Explicit = [string]$Entry.functionName
    }
    if (-not [string]::IsNullOrWhiteSpace($Explicit)) { return $Explicit }
    return Get-CamelName ([string]$Entry.id)
}

function Get-GroupLabel([string]$EntityId) {
    $Local = Get-LocalId $EntityId
    $Parts = @($Local.Split('_') | Where-Object { $_ })
    $Out = New-Object 'System.Collections.Generic.List[string]'
    foreach ($Part in $Parts) {
        if ($Part.Length -eq 1) {
            [void]$Out.Add($Part.ToUpperInvariant())
        }
        elseif ($Part -match '^[0-9]+$') {
            [void]$Out.Add($Part)
        }
        else {
            [void]$Out.Add($Part.Substring(0,1).ToUpperInvariant() + $Part.Substring(1))
        }
    }
    return ($Out -join ' ')
}

function Get-SafeToken([string]$Value) {
    return ([regex]::Replace($Value.ToLowerInvariant(), '[^a-z0-9_]+', '_')).Trim('_')
}

function Get-BlockId([string]$Kind, [string]$Id) {
    $Safe = Get-SafeToken $Id
    # Preserve the original generated blockId scheme for existing registries.
    # `entities` intentionally remains `entitie`; changing existing IDs would break saved blocks.
    $Singular = if ($Kind -eq 'families') {
        'family'
    }
    elseif ($Kind.EndsWith('s')) {
        $Kind.Substring(0, $Kind.Length - 1)
    }
    else {
        $Kind
    }
    return "mcfunction_${Singular}_registry_${Safe}"
}

function Quote-JsString([string]$Value) {
    return ($Value | ConvertTo-Json -Compress)
}

function Generate-FlatLibrary($Spec) {
    $Entries = @(Read-FlatRegistryEntries $Spec)
    # PowerShell hashtables compare string keys case-insensitively.
    # TypeScript identifiers are case-sensitive, so names such as tallGrass and
    # tallgrass are valid distinct reporter functions. Use .NET dictionaries
    # here to perform the collision check with case-sensitive string equality.
    $UsedNames = New-Object 'System.Collections.Generic.Dictionary[string,string]'
    $UsedBlockIds = New-Object 'System.Collections.Generic.Dictionary[string,string]'
    $Lines = New-Object 'System.Collections.Generic.List[string]'

    $RelativeSource = if ($Spec.SourceDir -eq $DerivedDir) {
        "registry/derived/bedrock/$($Spec.Kind).json"
    } else {
        "registry/source/bedrock/$($Spec.Kind).json"
    }

    @(
        '/**',
        ' * AUTO-GENERATED FILE. DO NOT EDIT BY HAND.',
        ' *',
        " * Source: $RelativeSource",
        ' * Generator: tools/generate_registry.ps1',
        ' *',
        ' * Reporter block text includes the canonical value so MakeCode Toolbox Search',
        ' * can find values without a second custom search UI.',
        ' */',
        '',
        "namespace $($Spec.Namespace) {",
        ''
    ) | ForEach-Object { [void]$Lines.Add($_) }

    for ($Index = 0; $Index -lt $Entries.Count; $Index++) {
        $Entry = $Entries[$Index]
        $Id = [string]$Entry.id
        $FunctionName = Get-FunctionName $Entry
        $BlockId = Get-BlockId $Spec.Kind $Id

        if ($UsedNames.ContainsKey($FunctionName)) {
            throw "Function-name collision in $($Spec.Kind): ${FunctionName}: $($UsedNames[$FunctionName]) / $Id"
        }
        if ($UsedBlockIds.ContainsKey($BlockId)) {
            throw "blockId collision in $($Spec.Kind): ${BlockId}: $($UsedBlockIds[$BlockId]) / $Id"
        }
        $UsedNames[$FunctionName] = $Id
        $UsedBlockIds[$BlockId] = $Id

        $Value = Quote-JsString $Id
        $Expression = $Spec.WrapPrefix + $Value + $Spec.WrapSuffix
        $Weight = 90 - ($Index % 40)

        @(
            '    //% group="Registry"',
            "    //% weight=$Weight",
            "    //% blockId=$BlockId",
            ('    //% block="' + $Spec.Prefix + ' ' + $Id + '"'),
            "    export function $FunctionName(): $($Spec.ReturnType) {",
            "        return $Expression;",
            '    }',
            ''
        ) | ForEach-Object { [void]$Lines.Add($_) }
    }

    [void]$Lines.Add('}')
    [void]$Lines.Add('')
    return (($Lines -join "`n") + "`n")
}

function Generate-RegistryLookup() {
    $Lines = New-Object 'System.Collections.Generic.List[string]'
    @(
        '/**',
        ' * AUTO-GENERATED FILE. DO NOT EDIT BY HAND.',
        ' *',
        ' * Sources:',
        ' * - registry/source/bedrock/blocks.json',
        ' * - registry/source/bedrock/entities.json',
        ' * - registry/source/bedrock/items.json',
        ' * Generator: tools/generate_registry.ps1',
        ' *',
        ' * Hidden runtime lookup used only by Definition Validation.',
        ' * Registry misses never change command meaning by themselves.',
        ' */',
        '',
        'namespace MCFunctionRegistryLookup {'
    ) | ForEach-Object { [void]$Lines.Add($_) }

    $LookupKinds = @(
        [ordered]@{ Kind='blocks'; Name='knownBlockIds' },
        [ordered]@{ Kind='entities'; Name='knownEntityIds' },
        [ordered]@{ Kind='items'; Name='knownItemIds' }
    )

    foreach ($Lookup in $LookupKinds) {
        $Spec = $FlatSpecs | Where-Object { $_.Kind -eq $Lookup.Kind } | Select-Object -First 1
        if (-not $Spec) { throw "Missing flat registry spec for $($Lookup.Kind)" }
        $Entries = @(Read-FlatRegistryEntries $Spec | Sort-Object { [string]$_.id })

        [void]$Lines.Add('    let ' + $Lookup.Name + ': string[] = [')
        foreach ($Entry in $Entries) {
            [void]$Lines.Add('        ' + (Quote-JsString ([string]$Entry.id)) + ',')
        }
        [void]$Lines.Add('    ];')
        [void]$Lines.Add('')
    }

    @(
        '    function normalizeVanillaId(value: string): string {',
        '        if (!value) return value;',
        '        if (value.indexOf(":") < 0) return "minecraft:" + value;',
        '        return value;',
        '    }',
        '',
        '    function containsSorted(values: string[], value: string): boolean {',
        '        let low = 0;',
        '        let high = values.length - 1;',
        '',
        '        while (low <= high) {',
        '            let middle = Math.floor((low + high) / 2);',
        '            let current = values[middle];',
        '',
        '            if (current == value) return true;',
        '            if (current < value) low = middle + 1;',
        '            else high = middle - 1;',
        '        }',
        '',
        '        return false;',
        '    }',
        '',
        '    export function isCustomNamespace(value: string): boolean {',
        '        if (!value) return false;',
        '        let separator = value.indexOf(":");',
        '        if (separator <= 0) return false;',
        '        return value.indexOf("minecraft:") != 0;',
        '    }',
        '',
        '    export function isKnownBlock(value: string): boolean {',
        '        return containsSorted(knownBlockIds, normalizeVanillaId(value));',
        '    }',
        '',
        '    export function isKnownEntity(value: string): boolean {',
        '        return containsSorted(knownEntityIds, normalizeVanillaId(value));',
        '    }',
        '',
        '    export function isKnownItem(value: string): boolean {',
        '        return containsSorted(knownItemIds, normalizeVanillaId(value));',
        '    }',
        '}',
        ''
    ) | ForEach-Object { [void]$Lines.Add($_) }

    return (($Lines -join "`n") + "`n")
}

function Generate-GroupedEventLibrary(
    [string]$Kind,
    [string]$Namespace,
    [string]$CategoryName,
    [string]$Prefix,
    [string]$BlockIdPrefix,
    [string]$Color,
    [int]$Weight,
    [string]$Icon,
    [string]$FileName
) {
    $Entities = @(Read-GroupedRegistry $Kind | Sort-Object { [string]$_.entity })
    $Groups = New-Object 'System.Collections.Generic.List[string]'
    [void]$Groups.Add('Direct Input')
    foreach ($EntityEntry in $Entities) {
        if (@($EntityEntry.events).Count -gt 0) {
            [void]$Groups.Add((Get-GroupLabel ([string]$EntityEntry.entity)))
        }
    }
    $GroupJsonItems = @($Groups | ForEach-Object { Quote-JsString ([string]$_) })
    $GroupsJson = '[' + ($GroupJsonItems -join ',') + ']'

    if ($Kind -eq 'entity_events') {
        $CustomBlockIdLine = '    //% blockId=mcfunction_entity_event_custom_id'
        $CustomBlockLine = '    //% block="event custom $eventId"'
    }
    else {
        $CustomBlockIdLine = '    //% blockId=mcfunction_spawn_event_custom_id'
        $CustomBlockLine = '    //% block="spawn event custom $eventId"'
    }

    $Lines = New-Object 'System.Collections.Generic.List[string]'
    @(
        '/**',
        ' * AUTO-GENERATED FILE. DO NOT EDIT BY HAND.',
        ' *',
        " * Source: registry/derived/bedrock/$Kind.json",
        ' * Generator: tools/generate_registry.ps1',
        ' *',
        ' * Values are grouped by vanilla entity for MakeCode Toolbox browsing.',
        ' * Direct/custom input remains available in this generated category.',
        ' */',
        '',
        ('//% color="{0}" weight={1} icon="{2}" block="{3}"' -f $Color, $Weight, $Icon, $CategoryName),
        ("//% groups='" + $GroupsJson + "'"),
        "namespace $Namespace {",
        '',
        '    //% group="Direct Input"',
        '    //% weight=100',
        $CustomBlockIdLine,
        $CustomBlockLine,
        '    //% eventId.shadow="text"',
        '    //% eventId.defl="minecraft:entity_spawned"',
        '    export function custom(eventId: string): string {',
        '        return eventId;',
        '    }',
        ''
    ) | ForEach-Object { [void]$Lines.Add($_) }

    # Keep generated TypeScript symbol collision checks case-sensitive.
    $UsedNames = New-Object 'System.Collections.Generic.Dictionary[string,string]'
    $UsedBlockIds = New-Object 'System.Collections.Generic.Dictionary[string,string]'
    $Total = 0

    foreach ($EntityEntry in $Entities) {
        $EntityId = [string]$EntityEntry.entity
        $Events = @($EntityEntry.events | ForEach-Object { [string]$_ } | Sort-Object)
        if ($Events.Count -eq 0) { continue }

        $GroupLabel = Get-GroupLabel $EntityId
        $EntityLocal = Get-LocalId $EntityId
        $EntityCamel = Get-CamelName $EntityId

        for ($Index = 0; $Index -lt $Events.Count; $Index++) {
            $EventId = $Events[$Index]
            $EventCamel = Get-CamelName $EventId
            $FunctionName = $EntityCamel + $EventCamel.Substring(0,1).ToUpperInvariant() + $EventCamel.Substring(1)
            if ($ReservedWords.ContainsKey($FunctionName)) { $FunctionName += 'Value' }

            $BlockId = $BlockIdPrefix + '_' + (Get-SafeToken $EntityId) + '_' + (Get-SafeToken $EventId)
            if ($UsedNames.ContainsKey($FunctionName)) {
                throw "Function-name collision in ${Kind}: ${FunctionName}: $($UsedNames[$FunctionName]) / $EntityId -> $EventId"
            }
            if ($UsedBlockIds.ContainsKey($BlockId)) {
                throw "blockId collision in ${Kind}: ${BlockId}: $($UsedBlockIds[$BlockId]) / $EntityId -> $EventId"
            }
            $UsedNames[$FunctionName] = "$EntityId -> $EventId"
            $UsedBlockIds[$BlockId] = "$EntityId -> $EventId"

            $Value = Quote-JsString $EventId
            $BlockWeight = 90 - ($Index % 40)
            @(
                ('    //% group="' + $GroupLabel + '"'),
                "    //% weight=$BlockWeight",
                "    //% blockId=$BlockId",
                ('    //% block="' + $EntityLocal + ' ' + $Prefix + ' ' + $EventId + '"'),
                "    export function $FunctionName(): string {",
                "        return $Value;",
                '    }',
                ''
            ) | ForEach-Object { [void]$Lines.Add($_) }
            $Total++
        }
    }

    [void]$Lines.Add('}')
    [void]$Lines.Add('')
    return [ordered]@{ Text=(($Lines -join "`n") + "`n"); Count=$Total; File=$FileName }
}

if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Force -Path $OutDir | Out-Null }

$Changed = New-Object 'System.Collections.Generic.List[string]'
$Counts = [ordered]@{}

foreach ($Spec in $FlatSpecs) {
    $OutPath = Join-Path $OutDir $Spec.File
    $Expected = Generate-FlatLibrary $Spec
    $Actual = if (Test-Path $OutPath) { [System.IO.File]::ReadAllText($OutPath) } else { $null }
    if ($Actual -ne $Expected) {
        [void]$Changed.Add($OutPath.Substring($Root.Length + 1))
        if (-not $Check) { [System.IO.File]::WriteAllText($OutPath, $Expected, $Utf8NoBom) }
    }
    $Counts[$Spec.Kind] = @(Read-FlatRegistryEntries $Spec).Count
}

$LookupOutDir = Join-Path $Root 'src\registry'
if (-not (Test-Path $LookupOutDir)) { New-Item -ItemType Directory -Force -Path $LookupOutDir | Out-Null }
$LookupOutPath = Join-Path $LookupOutDir 'registry_lookup.generated.ts'
$LookupExpected = Generate-RegistryLookup
$LookupActual = if (Test-Path $LookupOutPath) { [System.IO.File]::ReadAllText($LookupOutPath) } else { $null }
if ($LookupActual -ne $LookupExpected) {
    [void]$Changed.Add($LookupOutPath.Substring($Root.Length + 1))
    if (-not $Check) { [System.IO.File]::WriteAllText($LookupOutPath, $LookupExpected, $Utf8NoBom) }
}

$GroupedSpecs = @(
    [ordered]@{ Kind='entity_events'; Namespace='MCFunctionEntityEventLibrary'; Category='EVENT'; Prefix='event'; BlockIdPrefix='mcfunction_entity_event'; Color='#E67E22'; Weight=83; Icon='\uf0e7'; File='entity_event_library.generated.ts' },
    [ordered]@{ Kind='spawn_events'; Namespace='MCFunctionSpawnEventLibrary'; Category='SPAWN EVENT'; Prefix='spawn event'; BlockIdPrefix='mcfunction_spawn_event'; Color='#D35400'; Weight=82; Icon='\uf1d8'; File='spawn_event_library.generated.ts' }
)

foreach ($Spec in $GroupedSpecs) {
    $Generated = Generate-GroupedEventLibrary $Spec.Kind $Spec.Namespace $Spec.Category $Spec.Prefix $Spec.BlockIdPrefix $Spec.Color $Spec.Weight $Spec.Icon $Spec.File
    $OutPath = Join-Path $OutDir $Spec.File
    $Actual = if (Test-Path $OutPath) { [System.IO.File]::ReadAllText($OutPath) } else { $null }
    if ($Actual -ne $Generated.Text) {
        [void]$Changed.Add($OutPath.Substring($Root.Length + 1))
        if (-not $Check) { [System.IO.File]::WriteAllText($OutPath, $Generated.Text, $Utf8NoBom) }
    }
    $Counts[$Spec.Kind] = $Generated.Count
}

if ($Check -and $Changed.Count -gt 0) {
    Write-Host 'Generated Registry files are out of date:'
    foreach ($File in $Changed) { Write-Host "  $File" }
    exit 1
}

foreach ($Kind in $Counts.Keys) {
    Write-Host ('{0,-14}: {1}' -f $Kind, $Counts[$Kind])
}

if ($Changed.Count -gt 0 -and -not $Check) {
    Write-Host 'Generated:'
    foreach ($File in $Changed) { Write-Host "  $File" }
}
elseif ($Changed.Count -eq 0) {
    Write-Host 'Generated Registry files are up to date.'
}
