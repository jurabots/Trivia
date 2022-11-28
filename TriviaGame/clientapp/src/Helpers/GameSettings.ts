export const gameSettings= {
    font: "MuseoSlab-900",
    serverUrl: "http://fgf-trivia-api.somee.com",//"https://localhost:44399",//default, will be replaced by the data from alert
    signalrServerMethodsNames: {
        send: "Send",
        join: "Join",
        leave: "Leave",
    },

    signalrIncomingMethodsNames:{
        send: "Send",
        opponentJoined: "OpponentJoined",
        opponentLeave: "OpponentLeave",
        canPlay: "CanPlay",
    },

    apiEndpoints:{
        categories: "Categories",
        question: "Questions/By_Category",
        leaders: "Players/leaderboard",
    }
};