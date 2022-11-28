export const gameData = {
    spineLoaderOptions: {
        metadata: {
            spineSkeletonScale: 0.8,
        }
    },
    mysterySpineLoaderOptions: {
        metadata: {
            spineSkeletonScale: 1.1,
        }
    },
    charsNames:[
        'Red',
        'Yellow',
        'Nerdy',
        'Blue',
        'Gem_monster',
        'Gold_nugget_monster',
        'Cat',
        'Squirrel',
        'Stripes-zebra',
        'Snail',
        'Angel',
        'Zombie',
        'Corgi', 
        'Megadog', 
        'Panda',
        'Cattle',
        'Dinorobot'
    ],
    charsData: {
        'Red': {
            name: 'Red',
            resourceName: 'red_char',
            animationsList: {
                happy: "Red_Happy_loop",
                idle_gameplay: "Red_idle_gameplay_loop",
                idle_lobby: "Red_idle_lobby_loop",
                sad: "Red_sad_loop"
            },
            avatarWin: 'avatars/Win_Red.png',
            avatarLose: 'avatars/Lose_Red.png'
        },
        'Yellow': {
            name: 'Yellow',
            resourceName: 'yellow_char',
            animationsList: {
                happy: "Yellow_Happy",
                idle_gameplay: "Yellow_Idle_gameplay_loop",
                idle_lobby: "Yellow_Idle_lobby_loop",
                sad: "Yellow_sad"
            },
            avatarWin: 'avatars/Win_Yellow.png',
            avatarLose: 'avatars/Lose_Yellow.png'
        },
        'Nerdy': {
            name: 'Nerdy',
            resourceName: 'nerdy_char',
            animationsList: {
                happy: "Nerdy_Happy_loop",
                idle_gameplay: "Nerdy_Idle_gameplay_loop",
                idle_lobby: "Nerdy_Idle_Lobby_loop",
                sad: "Nerdy_Sad_loop"
            },
            avatarWin: 'avatars/Win_Neardy.png',
            avatarLose: 'avatars/Lose_Neardy.png'
        },
        'Blue': {
            name: 'Blue',
            resourceName: 'blue_char',
            animationsList: {
                happy: "Blue_happy_loop",
                idle_gameplay: "Blue_gameplay_idle_loop",
                idle_lobby: "Blue_lobby_idle_loop",
                sad: "Blue_sad_loop"
            },
            avatarWin: 'avatars/Win_Blue.png',
            avatarLose: 'avatars/Lose_Blue.png'
        },
        'Gem_monster': {
            name: 'Gem_monster',
            resourceName: 'gem_monster_char',
            animationsList: {
                happy: "Gem_monster_Happy_loop",
                idle_gameplay: "Gem_monster_gameplay_Idle_loop",
                idle_lobby: "Gem_monster_Lobby_Idle_loop",
                sad: "Gem_monster_Sad_loop"
            },
            avatarWin: 'avatars/Win_Gem Monster.png',
            avatarLose: 'avatars/Lose_Gem Monster.png'
        },
        'Gold_nugget_monster': {
            name: 'Gold_nugget_monster',
            resourceName: 'gold_nugget_monster_char',
            animationsList: {
                happy: "Gold_nugget_monster_Happy_loop",
                idle_gameplay: "Gold_nugget_monster_Gameplay_idle_loop",
                idle_lobby: "Gold_nugget_monster_Lobby_idle_loop",
                sad: "Gold_nugget_monster_sad_loop"
            },
            avatarWin: 'avatars/Win_Gold nugget.png',
            avatarLose: 'avatars/Lose_Gold nugget.png'
        },
        'Cat': {
            name: 'Cat',
            resourceName: 'cat_char',
            animationsList: {
                happy: "Cat_Happy_loop",
                idle_gameplay: "Cat_Idle_gameplay_loop",
                idle_lobby: "Cat_Idle_Lobby_loop",
                sad: "Cat_Sad_loop"
            },
            avatarWin: 'avatars/Win_Cat.png',
            avatarLose: 'avatars/Lose_Cat.png'
        },
        'Squirrel': {
            name: 'Squirrel',
            resourceName: 'squirrel_char',
            animationsList: {
                happy: "Squirrel_Happy_loop",
                idle_gameplay: "Squirrel_Idle_gameplay_loop",
                idle_lobby: "Squirrel_Idle_Lobby_loop",
                sad: "Squirrel_Sad_loop"
            },
            avatarWin: 'avatars/Win_Squirrel.png',
            avatarLose: 'avatars/Lose_Squirrel.png'
        },
        'Stripes-zebra': {
            name: 'Stripes-zebra',
            resourceName: 'stripes-zebra_char',
            animationsList: {
                happy: "Stripes-zebra_Happy_loop",
                idle_gameplay: "Stripes-zebra_Idle_gameplay_loop",
                idle_lobby: "Stripes-zebra_Idle_Lobby_loop",
                sad: "Stripes-zebra_Sad_loop"
            },
            avatarWin: 'avatars/Win_Zebra.png',
            avatarLose: 'avatars/Lose_Zebra.png'
        },
        'Snail': {
            name: 'Snail',
            resourceName: 'snail_char',
            animationsList: {
                happy: "Snail_Happy_loop",
                idle_gameplay: "Snail_Idle_gameplay_loop",
                idle_lobby: "Snail_Idle_lobby_loop",
                sad: "Snail_Sad_loop"
            },
            avatarWin: 'avatars/Win_snail.png',
            avatarLose: 'avatars/Lose_snail.png'
        },
        'Angel': {
            name: 'Angel',
            resourceName: 'angel_char',
            animationsList: {
                happy: "Angel_Happy_loop",
                idle_gameplay: "Angel_Idle_gameplay_loop",
                idle_lobby: "Angel_Idle_Lobby_loop",
                sad: "Angel_Sad_loop"
            },
            avatarWin: 'avatars/Win_Angel.png',
            avatarLose: 'avatars/Lose_Angel.png'
        },
        'Zombie': {
            name: 'Zombie',
            resourceName: 'zombie_char',
            animationsList: {
                happy: "Zombie_Happy_loop",
                idle_gameplay: "Zombie_Idle_gameplay_loop",
                idle_lobby: "Zombie_Idle_Lobby_loop",
                sad: "Zombie_Sad_loop"
            },
            avatarWin: 'avatars/Win_Zombie.png',
            avatarLose: 'avatars/Lose_Zombie.png'
        },
        'Corgi': {
            name: 'Corgi',
            resourceName: 'corgi_char',
            animationsList: {
                happy: "Corgi_Happy_loop",
                idle_gameplay: "Corgi_Idle_gameplay_loop",
                idle_lobby: "Corgi_Idle_Lobby_loop",
                sad: "Corgi_Sad_loop"
            },
            avatarWin: 'avatars/Win_Corgi.png',
            avatarLose: 'avatars/Lose_Corgi.png'
        },
        'Megadog':{
            name: 'Megadog',
            resourceName: 'megadog_char',
            animationsList: {
                happy: "Megadog_Happy_loop",
                idle_gameplay: "Megadog_gameplay_idle_loop",
                idle_lobby: "Megadog_lobby_idle_loop",
                sad: "Megadog_Sad_loop"
            },
            avatarWin: 'avatars/Win_Megadog.png',
            avatarLose: 'avatars/Lose_Megadog.png'
        },
        'Panda':{
            name: 'Panda',
            resourceName: 'panda_char',
            animationsList: {
                happy: "Red_panda_happy_loop",
                idle_gameplay: "Red_panda_Gameplay_idle_loop",
                idle_lobby: "Red_panda_Lobby_idle_loop",
                sad: "Red_panda_sad_loop"
            },
            avatarWin: 'avatars/Win_Red Panda.png',
            avatarLose: 'avatars/Lose_Red Panda.png'
        },
        'Cattle':{
            name: 'Cattle',
            resourceName: 'cattle_char',
            animationsList: {
                happy: "Cattle_Happy_loop",
                idle_gameplay: "Cattle_Idle_gameplay_loop",
                idle_lobby: "Cattle_Idle_lobby_loop",
                sad: "Cattle_Sad_loop"
            },
            avatarWin: 'avatars/Win_Cattle.png',
            avatarLose: 'avatars/Lose_Cattle.png'
        },
        'Dinorobot':{
            name: 'Dinorobot',
            resourceName: 'dinorobot_char',
            animationsList: {
                happy: "Dinorobot_happy_loop",
                idle_gameplay: "Dinorobot_idle_gameplay_loop",
                idle_lobby: "Dinorobot_idle_lobby_loop",
                sad: "Dinorobot_sad_loop"
            },
            avatarWin: 'avatars/Win_Dinorobot.png',
            avatarLose: 'avatars/Lose_Dinorobot.png'
        }
    },
    mysteryCharData: {
        name: 'Mystery',
        resourceName: 'mystery_char',
        animationsList: {
            idle_gameplay: "Mystery_gameplay_idle",
        }
    },


}