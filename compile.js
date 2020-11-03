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
        await command("npx babel dist/script --out-dir dist/script");
        await command("npx terser-folder dist/script -o dist/script -e -x .js");
    } catch (error) {
        console.log("Compilation failed");
    }
})();