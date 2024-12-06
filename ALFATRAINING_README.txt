Anmerkungen zu:
vite.config.ts

root: "E:/EldenTex",   // beschränkt das Scannen von Vite. Wenn dies nicht gesetzt ist, lädt er manchmal sehr lange

// ignoriert die Bild-Bibliothek für das HMR von Vite   
watch: {     
      ignored: ["**/public/AllAET_PNG/**", "**/public/AllAET_JPG/**"],
    },


// der server läuft auf 3030. Der client leitet api Anfragen auf 3030 weiter
proxy: {
      "/api": "http://localhost:3030", // Your backend port here
    },



start_Backend_and_Frontend.bat sollten den server und client starten