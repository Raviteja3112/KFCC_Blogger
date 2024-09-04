import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3124;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server starts listening at ${port}....`);
});


app.get("/", (req, res) => {
    res.render("userLogin.ejs");
});

app.get("/adminLogin", (req, res) => {
    res.render("adminLogin.ejs");
});

app.get("/forgotPassword", (req, res) => {
    if (req.body["adminPassword"])
        forgotPasswordFileAcess(req, res, __dirname + "/Files/adminData.txt");
    else 
        forgotPasswordFileAcess(req, res, __dirname + "/Files/userData.txt");
});

app.get("/home", (req, res) => {
    const filePath = __dirname + "/Files/postContent.txt"; 

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Internal Server Error");
        }
        console.log("PostContent started reading...");

        const lines = data.split("\n").filter(line => line.trim() !== ""); // Filter out empty lines
        // Prepare the posts array
        const posts = lines.map(line => {
            const parts = line.split(" $ ");
            if (parts.length < 3) return; // Skip lines with less than 3 parts
            const image = parts[0];
            const heading = parts[1];
            const content = parts.slice(2).join(" ");
            return { image,heading, content };
        }); // Filter out any undefined posts
        console.log(posts);
        res.render("homePage.ejs", { posts });
    });
});




app.post("/adminLogin", (req, res) => {
    fileCreationValidation(req, res, __dirname + "/Files/adminData.txt", "adminLogin.ejs");
});

app.post("/", (req, res) => {
    fileCreationValidation(req, res, __dirname + "/Files/userData.txt", "userLogin.ejs");
});


app.post("/addPost", (req, res) => {
    const path = __dirname + "/Files/postContent.txt";
    // Replace newline characters with a space or another delimiter
    const content = req.body["content"].replace(/[\r\n]+/g, ' ').trim();
    const data = `${req.body["image"]} $ ${req.body["heading"]} $ ${content}\n`;

    fs.appendFile(path, data, (err) => {
        if (err) {
            console.error("Error appending data to file:", err);
            return res.status(500).send("Internal Server Error");
        } else {
            console.log("Data appended successfully.");
            res.sendFile(__dirname + "/public/HTML/adminPage.html");
        }
    });
});






function fileCreationValidation(req, res, fileName, redirectTo) {
    console.log("function triggered...");
    console.log(req.body);

    if (req.body.clickedButton == "LogIn") {
        fs.access(fileName, fs.constants.F_OK, (err) => {
            if (err) {
                console.log("You don't have an account..");
                return res.render(redirectTo, {
                    warning: true,
                    warningContent: "You Don't have an Account!!!"
                });
            } else {
                fs.readFile(fileName, 'utf-8', (err, data) => {
                    if (err) {
                        console.error("Error reading file:", err);
                        return res.status(500).send("Internal Server Error");
                    }

                    let lines = data.split("\n").map(line => line.trim());
                    let matchFound = false;
                    for (let i = 0; i < lines.length; i++) {
                        let check = lines[i].split(" ");
                        if (check[0] === req.body["userId"] && check[1] === req.body["password"]) {
                            matchFound = true;
                            if (fileName.includes("adminData.txt")) {
                                return res.sendFile(__dirname+"/public/HTML/adminPage.html");
                            } else {
                                return res.redirect("/home");
                            }
                        }
                    }
                    if (!matchFound) {
                        return res.render(redirectTo, {
                            warning: true,
                            warningContent: "Sorry, invalid credentials. Please try again"
                        });
                    }
                });
            }
        });
    } else {
        let pass = req.body.createPassword;
        let confirmPass = req.body.createConfirmPassword;
        if (pass !== confirmPass) {
            console.log("Password is Not matching...");
            return res.render(redirectTo, {
                warning: true,
                warningContent: "Password is Not matching..."
            });
        } else {
            let userPassword = req.body.createUserId + " " + req.body["createPassword"];
            fs.access(fileName, fs.constants.F_OK, (err) => {
                if (err) {
                    fs.writeFile(fileName, userPassword, (err) => {
                        if (err) throw err;
                        console.log("Account Created Successfully...");
                        if (fileName.includes("adminData.txt")) {
                            return res.send("<h1>Hello Admin Bayyaa!!!!!!</h1>");
                        } else {
                            return res.send("<h1>Hello User Bayya Vanakkam!!!</h1>");
                        }
                    });
                } 
                else {
                    if (fileName.includes("adminData.txt")) {
                        console.log("Already had Account....");
                        return res.render(redirectTo, {
                            warning: true,
                            warningContent: "Already had Account...."
                        });
                    } else {
                        fs.appendFile(fileName, "\n" + userPassword, (err) => {
                            if (err) throw err;
                            console.log("New User Account Created Successfully...");
                            return res.render(redirectTo);
                        });
                    }
                }
            });
        }
    }
}


function forgotPasswordFileAcess(req, res, fileName) {
    fs.access(fileName, fs.constants.F_OK, (err) => {
        if (err) {
            console.log("There is no Account....");
            return res.status(404).send("Account not found");
        }
        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).send("Error reading file");
            }
            if (fileName.includes("adminData.txt")) {
                return res.send("User Name and Password: " + data);
            } else {
                let lines = data.split("\n").map(line => line.trim());
                let content = lines.join(", ");
                return res.send(content);
            }
        });
    });
}
