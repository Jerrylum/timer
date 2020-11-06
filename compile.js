const { exec } = require("child_process");

function command(cmd) {
    return new Promise(function(ok, fail) {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(error.message);
                fail();
                return;
            }
            if (stderr) {
                console.log(stderr);
                fail();
                return;
            }
            console.log(stdout);
            ok();
        });
    });
}


(async() => {
    try {
        await command("npx webpack");
        (async() => {
            await command("npx babel src/lang --out-dir dist/lang");
            await command("npx terser-folder dist/lang -o dist/lang -e -x .js"); // important, minifty utf-8, use terser-folder
        })();
        (async() => {
            await command("npx babel dist/static/bundle.js -o dist/static/bundle.js --minified --no-comments --no-highlight-code");
            await command("npx terser dist/static/bundle.js -o dist/static/bundle.js");
        })();
    } catch (error) {
        console.log("Compilation failed");
    }
})();