if (typeof FBInstant !== "undefined") {
    FBInstant.initializeAsync().then(function () {
        FBInstant.startGameAsync();
    });
}