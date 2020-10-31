const { exec } = require("child_process");
const { promises } = require("dns");
const ncp = require('ncp').ncp;


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

function copy() {
    return new Promise(function(ok, fail) {
        ncp.limit = 16;

        ncp("./src", "./dist", function(err) {
            if (err) {
                console.error(err);
                failed();
                return;
            }

            console.log('Files Copied!');
            ok();
        });
    });
}



(async() => {
    try {
        await copy();
        await command("npx babel src/script --out-dir dist/script");
        await command("npx babel src/lang --out-dir dist/lang");
        await command("npx terser-folder dist/script -o dist/script -e -x .js");
        await command("npx terser-folder dist/lang -o dist/lang -e -x .js");
    } catch (error) {
        console.log("Compilation failed");
    }
})();