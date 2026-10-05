/**
 * AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
 *
 * Source: registry/derived/bedrock/spawn_events.json
 * Generator: tools/generate_registry.ps1
 *
 * Values are grouped by vanilla entity for MakeCode Toolbox browsing.
 * Direct/custom input remains available in this generated category.
 */

//% color="#D35400" weight=82 icon="\uf1d8" block="SPAWN EVENT"
//% groups='["Direct Input","Allay","Armadillo","Arrow","Axolotl","Bee","Blaze","Boat","Bogged","Camel","Camel Husk","Cat","Cave Spider","Chest Boat","Chicken","Command Block Minecart","Copper Golem","Cow","Creaking","Dolphin","Donkey","Drowned","Ender Dragon","Ender Pearl","Enderman","Evocation Illager","Fishing Hook","Fox","Frog","Glow Squid","Goat","Happy Ghast","Hoglin","Hopper Minecart","Horse","Husk","Llama","Magma Cube","Mooshroom","Mule","Nautilus","Ocelot","Panda","Parched","Parrot","Pig","Piglin","Piglin Brute","Pillager","Polar Bear","Pufferfish","Rabbit","Ravager","Salmon","Sheep","Shulker","Silverfish","Skeleton","Skeleton Horse","Slime","Sniffer","Spider","Squid","Stray","Strider","Sulfur Cube","Tnt Minecart","Trader Llama","Tropicalfish","Turtle","Villager","Villager V2","Vindicator","Warden","Witch","Wither","Wither Skeleton","Wolf","Zoglin","Zombie","Zombie Horse","Zombie Nautilus","Zombie Pigman","Zombie Villager","Zombie Villager V2"]'
namespace MCFunctionSpawnEventLibrary {

    //% group="Direct Input"
    //% weight=100
    //% blockId=mcfunction_spawn_event_custom_id
    //% block="spawn event custom $eventId"
    //% eventId.shadow="text"
    //% eventId.defl="minecraft:entity_spawned"
    export function custom(eventId: string): string {
        return eventId;
    }

    //% group="Allay"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_allay_minecraft_entity_spawned
    //% block="allay spawn event minecraft:entity_spawned"
    export function allayEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Armadillo"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_armadillo_minecraft_entity_born
    //% block="armadillo spawn event minecraft:entity_born"
    export function armadilloEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Armadillo"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_armadillo_minecraft_entity_spawned
    //% block="armadillo spawn event minecraft:entity_spawned"
    export function armadilloEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Arrow"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_arrow_minecraft_entity_spawned
    //% block="arrow spawn event minecraft:entity_spawned"
    export function arrowEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Axolotl"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_axolotl_minecraft_entity_born
    //% block="axolotl spawn event minecraft:entity_born"
    export function axolotlEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Axolotl"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_axolotl_minecraft_entity_spawned
    //% block="axolotl spawn event minecraft:entity_spawned"
    export function axolotlEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Bee"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_bee_minecraft_entity_born
    //% block="bee spawn event minecraft:entity_born"
    export function beeEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Bee"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_bee_minecraft_entity_spawned
    //% block="bee spawn event minecraft:entity_spawned"
    export function beeEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Blaze"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_blaze_minecraft_entity_spawned
    //% block="blaze spawn event minecraft:entity_spawned"
    export function blazeEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Boat"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_boat_minecraft_entity_spawned
    //% block="boat spawn event minecraft:entity_spawned"
    export function boatEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Bogged"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_bogged_minecraft_entity_spawned
    //% block="bogged spawn event minecraft:entity_spawned"
    export function boggedEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Bogged"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_bogged_minecraft_ranged_mode
    //% block="bogged spawn event minecraft:ranged_mode"
    export function boggedRangedMode(): string {
        return "minecraft:ranged_mode";
    }

    //% group="Camel"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_camel_minecraft_entity_born
    //% block="camel spawn event minecraft:entity_born"
    export function camelEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Camel"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_camel_minecraft_entity_spawned
    //% block="camel spawn event minecraft:entity_spawned"
    export function camelEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Camel Husk"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_camel_husk_minecraft_entity_spawned
    //% block="camel_husk spawn event minecraft:entity_spawned"
    export function camelHuskEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Cat"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_cat_minecraft_entity_born
    //% block="cat spawn event minecraft:entity_born"
    export function catEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Cat"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_cat_minecraft_entity_spawned
    //% block="cat spawn event minecraft:entity_spawned"
    export function catEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Cave Spider"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_cave_spider_minecraft_entity_spawned
    //% block="cave_spider spawn event minecraft:entity_spawned"
    export function caveSpiderEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Chest Boat"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_chest_boat_minecraft_entity_spawned
    //% block="chest_boat spawn event minecraft:entity_spawned"
    export function chestBoatEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Chicken"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_chicken_minecraft_entity_born
    //% block="chicken spawn event minecraft:entity_born"
    export function chickenEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Chicken"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_chicken_minecraft_entity_spawned
    //% block="chicken spawn event minecraft:entity_spawned"
    export function chickenEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Command Block Minecart"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_command_block_minecart_minecraft_entity_spawned
    //% block="command_block_minecart spawn event minecraft:entity_spawned"
    export function commandBlockMinecartEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Copper Golem"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_copper_golem_minecraft_entity_spawned
    //% block="copper_golem spawn event minecraft:entity_spawned"
    export function copperGolemEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Cow"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_cow_minecraft_entity_born
    //% block="cow spawn event minecraft:entity_born"
    export function cowEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Cow"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_cow_minecraft_entity_spawned
    //% block="cow spawn event minecraft:entity_spawned"
    export function cowEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Cow"
    //% weight=88
    //% blockId=mcfunction_spawn_event_minecraft_cow_minecraft_entity_transformed
    //% block="cow spawn event minecraft:entity_transformed"
    export function cowEntityTransformed(): string {
        return "minecraft:entity_transformed";
    }

    //% group="Creaking"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_creaking_minecraft_entity_spawned
    //% block="creaking spawn event minecraft:entity_spawned"
    export function creakingEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Dolphin"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_dolphin_minecraft_entity_born
    //% block="dolphin spawn event minecraft:entity_born"
    export function dolphinEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Dolphin"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_dolphin_minecraft_entity_spawned
    //% block="dolphin spawn event minecraft:entity_spawned"
    export function dolphinEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Donkey"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_donkey_minecraft_entity_born
    //% block="donkey spawn event minecraft:entity_born"
    export function donkeyEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Donkey"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_donkey_minecraft_entity_spawned
    //% block="donkey spawn event minecraft:entity_spawned"
    export function donkeyEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Drowned"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_drowned_minecraft_entity_born
    //% block="drowned spawn event minecraft:entity_born"
    export function drownedEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Drowned"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_drowned_minecraft_entity_spawned
    //% block="drowned spawn event minecraft:entity_spawned"
    export function drownedEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Ender Dragon"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_ender_dragon_minecraft_entity_spawned
    //% block="ender_dragon spawn event minecraft:entity_spawned"
    export function enderDragonEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Ender Pearl"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_ender_pearl_minecraft_entity_spawned
    //% block="ender_pearl spawn event minecraft:entity_spawned"
    export function enderPearlEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Enderman"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_enderman_minecraft_entity_spawned
    //% block="enderman spawn event minecraft:entity_spawned"
    export function endermanEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Evocation Illager"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_evocation_illager_minecraft_spawn_for_raid
    //% block="evocation_illager spawn event minecraft:spawn_for_raid"
    export function evocationIllagerSpawnForRaid(): string {
        return "minecraft:spawn_for_raid";
    }

    //% group="Fishing Hook"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_fishing_hook_minecraft_entity_spawned
    //% block="fishing_hook spawn event minecraft:entity_spawned"
    export function fishingHookEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Fox"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_fox_minecraft_entity_born
    //% block="fox spawn event minecraft:entity_born"
    export function foxEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Fox"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_fox_minecraft_entity_spawned
    //% block="fox spawn event minecraft:entity_spawned"
    export function foxEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Frog"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_frog_minecraft_entity_spawned
    //% block="frog spawn event minecraft:entity_spawned"
    export function frogEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Frog"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_frog_minecraft_entity_transformed
    //% block="frog spawn event minecraft:entity_transformed"
    export function frogEntityTransformed(): string {
        return "minecraft:entity_transformed";
    }

    //% group="Glow Squid"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_glow_squid_minecraft_entity_born
    //% block="glow_squid spawn event minecraft:entity_born"
    export function glowSquidEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Glow Squid"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_glow_squid_minecraft_entity_spawned
    //% block="glow_squid spawn event minecraft:entity_spawned"
    export function glowSquidEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Goat"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_goat_minecraft_entity_born
    //% block="goat spawn event minecraft:entity_born"
    export function goatEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Goat"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_goat_minecraft_entity_spawned
    //% block="goat spawn event minecraft:entity_spawned"
    export function goatEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Happy Ghast"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_happy_ghast_minecraft_entity_born
    //% block="happy_ghast spawn event minecraft:entity_born"
    export function happyGhastEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Happy Ghast"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_happy_ghast_minecraft_entity_spawned
    //% block="happy_ghast spawn event minecraft:entity_spawned"
    export function happyGhastEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Hoglin"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_hoglin_minecraft_entity_born
    //% block="hoglin spawn event minecraft:entity_born"
    export function hoglinEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Hoglin"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_hoglin_minecraft_entity_spawned
    //% block="hoglin spawn event minecraft:entity_spawned"
    export function hoglinEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Hopper Minecart"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_hopper_minecart_minecraft_entity_spawned
    //% block="hopper_minecart spawn event minecraft:entity_spawned"
    export function hopperMinecartEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Horse"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_horse_minecraft_entity_born
    //% block="horse spawn event minecraft:entity_born"
    export function horseEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Horse"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_horse_minecraft_entity_spawned
    //% block="horse spawn event minecraft:entity_spawned"
    export function horseEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Husk"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_husk_minecraft_entity_born
    //% block="husk spawn event minecraft:entity_born"
    export function huskEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Husk"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_husk_minecraft_entity_spawned
    //% block="husk spawn event minecraft:entity_spawned"
    export function huskEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Husk"
    //% weight=88
    //% blockId=mcfunction_spawn_event_minecraft_husk_minecraft_spawn_as_rider
    //% block="husk spawn event minecraft:spawn_as_rider"
    export function huskSpawnAsRider(): string {
        return "minecraft:spawn_as_rider";
    }

    //% group="Llama"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_llama_minecraft_entity_born
    //% block="llama spawn event minecraft:entity_born"
    export function llamaEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Llama"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_llama_minecraft_entity_spawned
    //% block="llama spawn event minecraft:entity_spawned"
    export function llamaEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Magma Cube"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_magma_cube_minecraft_entity_spawned
    //% block="magma_cube spawn event minecraft:entity_spawned"
    export function magmaCubeEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Mooshroom"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_mooshroom_minecraft_entity_born
    //% block="mooshroom spawn event minecraft:entity_born"
    export function mooshroomEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Mooshroom"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_mooshroom_minecraft_entity_spawned
    //% block="mooshroom spawn event minecraft:entity_spawned"
    export function mooshroomEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Mule"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_mule_minecraft_entity_born
    //% block="mule spawn event minecraft:entity_born"
    export function muleEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Mule"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_mule_minecraft_entity_spawned
    //% block="mule spawn event minecraft:entity_spawned"
    export function muleEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Nautilus"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_nautilus_minecraft_entity_born
    //% block="nautilus spawn event minecraft:entity_born"
    export function nautilusEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Nautilus"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_nautilus_minecraft_entity_spawned
    //% block="nautilus spawn event minecraft:entity_spawned"
    export function nautilusEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Ocelot"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_ocelot_minecraft_entity_born
    //% block="ocelot spawn event minecraft:entity_born"
    export function ocelotEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Ocelot"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_ocelot_minecraft_entity_spawned
    //% block="ocelot spawn event minecraft:entity_spawned"
    export function ocelotEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Panda"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_panda_minecraft_entity_born
    //% block="panda spawn event minecraft:entity_born"
    export function pandaEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Panda"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_panda_minecraft_entity_spawned
    //% block="panda spawn event minecraft:entity_spawned"
    export function pandaEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Parched"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_parched_minecraft_entity_spawned
    //% block="parched spawn event minecraft:entity_spawned"
    export function parchedEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Parched"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_parched_minecraft_ranged_mode
    //% block="parched spawn event minecraft:ranged_mode"
    export function parchedRangedMode(): string {
        return "minecraft:ranged_mode";
    }

    //% group="Parrot"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_parrot_minecraft_entity_spawned
    //% block="parrot spawn event minecraft:entity_spawned"
    export function parrotEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Pig"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_pig_minecraft_entity_born
    //% block="pig spawn event minecraft:entity_born"
    export function pigEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Pig"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_pig_minecraft_entity_spawned
    //% block="pig spawn event minecraft:entity_spawned"
    export function pigEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Piglin"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_piglin_minecraft_entity_born
    //% block="piglin spawn event minecraft:entity_born"
    export function piglinEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Piglin"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_piglin_minecraft_entity_spawned
    //% block="piglin spawn event minecraft:entity_spawned"
    export function piglinEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Piglin Brute"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_piglin_brute_minecraft_entity_spawned
    //% block="piglin_brute spawn event minecraft:entity_spawned"
    export function piglinBruteEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Pillager"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_pillager_minecraft_entity_spawned
    //% block="pillager spawn event minecraft:entity_spawned"
    export function pillagerEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Pillager"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_pillager_minecraft_ranged_mode
    //% block="pillager spawn event minecraft:ranged_mode"
    export function pillagerRangedMode(): string {
        return "minecraft:ranged_mode";
    }

    //% group="Pillager"
    //% weight=88
    //% blockId=mcfunction_spawn_event_minecraft_pillager_minecraft_spawn_as_illager_captain
    //% block="pillager spawn event minecraft:spawn_as_illager_captain"
    export function pillagerSpawnAsIllagerCaptain(): string {
        return "minecraft:spawn_as_illager_captain";
    }

    //% group="Pillager"
    //% weight=87
    //% blockId=mcfunction_spawn_event_minecraft_pillager_minecraft_spawn_for_raid
    //% block="pillager spawn event minecraft:spawn_for_raid"
    export function pillagerSpawnForRaid(): string {
        return "minecraft:spawn_for_raid";
    }

    //% group="Polar Bear"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_polar_bear_minecraft_entity_born
    //% block="polar_bear spawn event minecraft:entity_born"
    export function polarBearEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Polar Bear"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_polar_bear_minecraft_entity_spawned
    //% block="polar_bear spawn event minecraft:entity_spawned"
    export function polarBearEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Pufferfish"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_pufferfish_minecraft_entity_spawned
    //% block="pufferfish spawn event minecraft:entity_spawned"
    export function pufferfishEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Rabbit"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_rabbit_minecraft_entity_born
    //% block="rabbit spawn event minecraft:entity_born"
    export function rabbitEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Rabbit"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_rabbit_minecraft_entity_spawned
    //% block="rabbit spawn event minecraft:entity_spawned"
    export function rabbitEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Ravager"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_ravager_minecraft_entity_spawned
    //% block="ravager spawn event minecraft:entity_spawned"
    export function ravagerEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Ravager"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_ravager_minecraft_spawn_for_raid
    //% block="ravager spawn event minecraft:spawn_for_raid"
    export function ravagerSpawnForRaid(): string {
        return "minecraft:spawn_for_raid";
    }

    //% group="Salmon"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_salmon_minecraft_entity_spawned
    //% block="salmon spawn event minecraft:entity_spawned"
    export function salmonEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Sheep"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_sheep_minecraft_entity_born
    //% block="sheep spawn event minecraft:entity_born"
    export function sheepEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Sheep"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_sheep_minecraft_entity_spawned
    //% block="sheep spawn event minecraft:entity_spawned"
    export function sheepEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Shulker"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_shulker_minecraft_entity_spawned
    //% block="shulker spawn event minecraft:entity_spawned"
    export function shulkerEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Silverfish"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_silverfish_minecraft_entity_spawned
    //% block="silverfish spawn event minecraft:entity_spawned"
    export function silverfishEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Skeleton"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_skeleton_minecraft_entity_spawned
    //% block="skeleton spawn event minecraft:entity_spawned"
    export function skeletonEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Skeleton"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_skeleton_minecraft_ranged_mode
    //% block="skeleton spawn event minecraft:ranged_mode"
    export function skeletonRangedMode(): string {
        return "minecraft:ranged_mode";
    }

    //% group="Skeleton Horse"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_skeleton_horse_minecraft_entity_born
    //% block="skeleton_horse spawn event minecraft:entity_born"
    export function skeletonHorseEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Skeleton Horse"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_skeleton_horse_minecraft_entity_spawned
    //% block="skeleton_horse spawn event minecraft:entity_spawned"
    export function skeletonHorseEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Slime"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_slime_minecraft_entity_spawned
    //% block="slime spawn event minecraft:entity_spawned"
    export function slimeEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Sniffer"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_sniffer_minecraft_entity_born
    //% block="sniffer spawn event minecraft:entity_born"
    export function snifferEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Sniffer"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_sniffer_minecraft_entity_spawned
    //% block="sniffer spawn event minecraft:entity_spawned"
    export function snifferEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Spider"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_spider_minecraft_entity_spawned
    //% block="spider spawn event minecraft:entity_spawned"
    export function spiderEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Squid"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_squid_minecraft_entity_born
    //% block="squid spawn event minecraft:entity_born"
    export function squidEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Squid"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_squid_minecraft_entity_spawned
    //% block="squid spawn event minecraft:entity_spawned"
    export function squidEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Stray"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_stray_minecraft_entity_spawned
    //% block="stray spawn event minecraft:entity_spawned"
    export function strayEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Stray"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_stray_minecraft_ranged_mode
    //% block="stray spawn event minecraft:ranged_mode"
    export function strayRangedMode(): string {
        return "minecraft:ranged_mode";
    }

    //% group="Strider"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_strider_minecraft_entity_born
    //% block="strider spawn event minecraft:entity_born"
    export function striderEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Strider"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_strider_minecraft_entity_spawned
    //% block="strider spawn event minecraft:entity_spawned"
    export function striderEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Strider"
    //% weight=88
    //% blockId=mcfunction_spawn_event_minecraft_strider_minecraft_spawn_baby_strider_jockey
    //% block="strider spawn event minecraft:spawn_baby_strider_jockey"
    export function striderSpawnBabyStriderJockey(): string {
        return "minecraft:spawn_baby_strider_jockey";
    }

    //% group="Sulfur Cube"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_sulfur_cube_minecraft_entity_born
    //% block="sulfur_cube spawn event minecraft:entity_born"
    export function sulfurCubeEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Sulfur Cube"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_sulfur_cube_minecraft_entity_spawned
    //% block="sulfur_cube spawn event minecraft:entity_spawned"
    export function sulfurCubeEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Tnt Minecart"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_tnt_minecart_minecraft_entity_spawned
    //% block="tnt_minecart spawn event minecraft:entity_spawned"
    export function tntMinecartEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Trader Llama"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_trader_llama_minecraft_entity_born
    //% block="trader_llama spawn event minecraft:entity_born"
    export function traderLlamaEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Trader Llama"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_trader_llama_minecraft_entity_spawned
    //% block="trader_llama spawn event minecraft:entity_spawned"
    export function traderLlamaEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Trader Llama"
    //% weight=88
    //% blockId=mcfunction_spawn_event_minecraft_trader_llama_minecraft_from_wandering_trader
    //% block="trader_llama spawn event minecraft:from_wandering_trader"
    export function traderLlamaFromWanderingTrader(): string {
        return "minecraft:from_wandering_trader";
    }

    //% group="Tropicalfish"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_tropicalfish_minecraft_entity_spawned
    //% block="tropicalfish spawn event minecraft:entity_spawned"
    export function tropicalfishEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Turtle"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_turtle_minecraft_entity_born
    //% block="turtle spawn event minecraft:entity_born"
    export function turtleEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Turtle"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_turtle_minecraft_entity_spawned
    //% block="turtle spawn event minecraft:entity_spawned"
    export function turtleEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Villager"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_villager_minecraft_entity_born
    //% block="villager spawn event minecraft:entity_born"
    export function villagerEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Villager"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_villager_minecraft_entity_spawned
    //% block="villager spawn event minecraft:entity_spawned"
    export function villagerEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Villager"
    //% weight=88
    //% blockId=mcfunction_spawn_event_minecraft_villager_minecraft_entity_transformed
    //% block="villager spawn event minecraft:entity_transformed"
    export function villagerEntityTransformed(): string {
        return "minecraft:entity_transformed";
    }

    //% group="Villager V2"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_villager_v2_minecraft_entity_born
    //% block="villager_v2 spawn event minecraft:entity_born"
    export function villagerV2EntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Villager V2"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_villager_v2_minecraft_entity_spawned
    //% block="villager_v2 spawn event minecraft:entity_spawned"
    export function villagerV2EntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Villager V2"
    //% weight=88
    //% blockId=mcfunction_spawn_event_minecraft_villager_v2_minecraft_entity_transformed
    //% block="villager_v2 spawn event minecraft:entity_transformed"
    export function villagerV2EntityTransformed(): string {
        return "minecraft:entity_transformed";
    }

    //% group="Vindicator"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_vindicator_minecraft_entity_spawned
    //% block="vindicator spawn event minecraft:entity_spawned"
    export function vindicatorEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Vindicator"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_vindicator_minecraft_spawn_as_illager_captain
    //% block="vindicator spawn event minecraft:spawn_as_illager_captain"
    export function vindicatorSpawnAsIllagerCaptain(): string {
        return "minecraft:spawn_as_illager_captain";
    }

    //% group="Vindicator"
    //% weight=88
    //% blockId=mcfunction_spawn_event_minecraft_vindicator_minecraft_spawn_for_raid
    //% block="vindicator spawn event minecraft:spawn_for_raid"
    export function vindicatorSpawnForRaid(): string {
        return "minecraft:spawn_for_raid";
    }

    //% group="Warden"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_warden_minecraft_entity_spawned
    //% block="warden spawn event minecraft:entity_spawned"
    export function wardenEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Witch"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_witch_minecraft_spawn_for_raid
    //% block="witch spawn event minecraft:spawn_for_raid"
    export function witchSpawnForRaid(): string {
        return "minecraft:spawn_for_raid";
    }

    //% group="Wither"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_wither_minecraft_entity_spawned
    //% block="wither spawn event minecraft:entity_spawned"
    export function witherEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Wither Skeleton"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_wither_skeleton_minecraft_entity_spawned
    //% block="wither_skeleton spawn event minecraft:entity_spawned"
    export function witherSkeletonEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Wolf"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_wolf_minecraft_entity_born
    //% block="wolf spawn event minecraft:entity_born"
    export function wolfEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Wolf"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_wolf_minecraft_entity_spawned
    //% block="wolf spawn event minecraft:entity_spawned"
    export function wolfEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Zoglin"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_zoglin_minecraft_entity_born
    //% block="zoglin spawn event minecraft:entity_born"
    export function zoglinEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Zoglin"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_zoglin_minecraft_entity_spawned
    //% block="zoglin spawn event minecraft:entity_spawned"
    export function zoglinEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Zoglin"
    //% weight=88
    //% blockId=mcfunction_spawn_event_minecraft_zoglin_minecraft_entity_transformed
    //% block="zoglin spawn event minecraft:entity_transformed"
    export function zoglinEntityTransformed(): string {
        return "minecraft:entity_transformed";
    }

    //% group="Zombie"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_zombie_minecraft_entity_born
    //% block="zombie spawn event minecraft:entity_born"
    export function zombieEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Zombie"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_zombie_minecraft_entity_spawned
    //% block="zombie spawn event minecraft:entity_spawned"
    export function zombieEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Zombie"
    //% weight=88
    //% blockId=mcfunction_spawn_event_minecraft_zombie_minecraft_spawn_as_rider
    //% block="zombie spawn event minecraft:spawn_as_rider"
    export function zombieSpawnAsRider(): string {
        return "minecraft:spawn_as_rider";
    }

    //% group="Zombie Horse"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_zombie_horse_minecraft_entity_born
    //% block="zombie_horse spawn event minecraft:entity_born"
    export function zombieHorseEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Zombie Horse"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_zombie_horse_minecraft_entity_spawned
    //% block="zombie_horse spawn event minecraft:entity_spawned"
    export function zombieHorseEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Zombie Nautilus"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_zombie_nautilus_minecraft_entity_spawned
    //% block="zombie_nautilus spawn event minecraft:entity_spawned"
    export function zombieNautilusEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Zombie Pigman"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_zombie_pigman_minecraft_entity_born
    //% block="zombie_pigman spawn event minecraft:entity_born"
    export function zombiePigmanEntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Zombie Pigman"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_zombie_pigman_minecraft_entity_spawned
    //% block="zombie_pigman spawn event minecraft:entity_spawned"
    export function zombiePigmanEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Zombie Pigman"
    //% weight=88
    //% blockId=mcfunction_spawn_event_minecraft_zombie_pigman_minecraft_entity_transformed
    //% block="zombie_pigman spawn event minecraft:entity_transformed"
    export function zombiePigmanEntityTransformed(): string {
        return "minecraft:entity_transformed";
    }

    //% group="Zombie Pigman"
    //% weight=87
    //% blockId=mcfunction_spawn_event_minecraft_zombie_pigman_minecraft_spawn_as_strider_jockey
    //% block="zombie_pigman spawn event minecraft:spawn_as_strider_jockey"
    export function zombiePigmanSpawnAsStriderJockey(): string {
        return "minecraft:spawn_as_strider_jockey";
    }

    //% group="Zombie Villager"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_zombie_villager_minecraft_entity_spawned
    //% block="zombie_villager spawn event minecraft:entity_spawned"
    export function zombieVillagerEntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Zombie Villager"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_zombie_villager_minecraft_entity_transformed
    //% block="zombie_villager spawn event minecraft:entity_transformed"
    export function zombieVillagerEntityTransformed(): string {
        return "minecraft:entity_transformed";
    }

    //% group="Zombie Villager V2"
    //% weight=90
    //% blockId=mcfunction_spawn_event_minecraft_zombie_villager_v2_minecraft_entity_born
    //% block="zombie_villager_v2 spawn event minecraft:entity_born"
    export function zombieVillagerV2EntityBorn(): string {
        return "minecraft:entity_born";
    }

    //% group="Zombie Villager V2"
    //% weight=89
    //% blockId=mcfunction_spawn_event_minecraft_zombie_villager_v2_minecraft_entity_spawned
    //% block="zombie_villager_v2 spawn event minecraft:entity_spawned"
    export function zombieVillagerV2EntitySpawned(): string {
        return "minecraft:entity_spawned";
    }

    //% group="Zombie Villager V2"
    //% weight=88
    //% blockId=mcfunction_spawn_event_minecraft_zombie_villager_v2_minecraft_entity_transformed
    //% block="zombie_villager_v2 spawn event minecraft:entity_transformed"
    export function zombieVillagerV2EntityTransformed(): string {
        return "minecraft:entity_transformed";
    }

}

