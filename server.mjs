import { createServer } from "node:http";

const corsHeader = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

let users = [
  { id: 1, ism: "bilol", yosh: "21", shahar: "suwon" },
  { id: 2, ism: "jonibek", yosh: "24", shahar: "suwon" },
  { id: 3, ism: "nodir", yosh: "26", shahar: "suwon" },
];

const server = createServer((req, res) => {
  try {
    if (req.method === "OPTIONS") {
      res.writeHead(201, corsHeader);
      res.end();
      return;
    }

    if (req.url.startsWith("/users/")) {
      const userID = req.url.split("/")[2];
      if (req.method === "PUT") {
        const updatedUser = users.find((a) => a.id === parseInt(userID));
        if (updatedUser) {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            const newInfo = JSON.parse(body);
            updatedUser.ism = newInfo.ism;
            updatedUser.yosh = newInfo.yosh;
            updatedUser.shahar = newInfo.shahar;
            res.writeHead(200, corsHeader);
            res.end(JSON.stringify({ ...updatedUser, status: "success" }));
            return;
          });
        }
        return
      } else if (req.method === "DELETE") {
        const deletedUser = users.find((a) => a.id === parseInt(userID));
        if (deletedUser) {
          users = users.filter((a) => a.id !== parseInt(userID))
          res.writeHead(200, corsHeader);
          res.end(JSON.stringify({ status: "success" }));
        }
        return
      } else {
        res.writeHead(405, corsHeader);
        res.end(JSON.stringify({ xatolik: " user not found" }));
        return;
      }
      return;
    }

    if (req.url === "/users") {
      console.log("serverga sorov keldi");
      if (req.method === "GET") {
        res.writeHead(200, corsHeader);
        res.end(JSON.stringify(users));
      } else if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          const newUser = JSON.parse(body);
          newUser.id = users.length + 1;
          users.push(newUser);
          res.writeHead(201, corsHeader);
          res.end(JSON.stringify({ ...newUser, status: "success" }));
        });
      } else {
        res.writeHead(405, corsHeader);
        res.end(JSON.stringify({ xatolik: "sorov metodi notogri" }));
      }
    } else {
      res.writeHead(404, corsHeader);
      res.end(JSON.stringify({ xatolik: "url metodi notogri" }));
    }
  } catch (err) {
    console.error("sorovda xatolik ", err);
  }
});

server.listen(1234, () => {
  console.log("1234 port ishlayapti");
});
