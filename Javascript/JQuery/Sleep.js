function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

sleep(1000) // 1000 === 1 second