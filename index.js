const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const db = require("./connection");
const response = require("./response");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  response(200, "API V1 ready to go", "SUCCES", res);
});

app.get("/mahasiswa", (req, res) => {
  const sql = "SELECT * FROM mahasiswa";
  db.query(sql, (err, fields) => {
    console.log(fields);
    if (err) throw err;
    response(200, fields, "mahasiwa get list", res);
  });
});

app.get("/mahasiswa/:nim", (req, res) => {
  const nim = req.params.nim;
  const sql = `SELECT * FROM mahasiswa WHERE  nim = ${nim}`;
  db.query(sql, (err, fields) => {
    if (err) throw err;
    response(200, fields, "get detail mahasiswa", res);
  });
});

app.post("/mahasiswa", (req, res) => {
  const { nim, nama_lengkap, alamat, jurusan } = req.body;
  const sql = `INSERT INTO mahasiswa (nim,nama_lengkap,alamat,jurusan) VALUES ('${nim}', '${nama_lengkap}', '${alamat}', '${jurusan}') `;
  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res);
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId,
      };
      response(200, data, "add data succesfully", res);
    }
  });
});

app.put("/mahasiswa", (req, res) => {
  const { nim, nama_lengkap, alamat, jurusan } = req.body;
  const sql = `UPDATE mahasiswa SET nama_lengkap = '${nama_lengkap}', alamat = '${alamat}', jurusan = '${jurusan}' WHERE nim = ${nim}`;

  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res);
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        message: fields.message,
      };
      response(200, data, "INI PUT ATAU UPDATE DATA", res);
    } else {
      response(404, "user not found", "error", res);
    }
  });
});

app.delete("/mahasiswa", (req, res) => {
  const { nim } = req.body;
  const sql = `DELETE FROM mahasiswa WHERE nim =${nim}`;
  db.query(sql, (err, fields) => {
    if (err) response(500, "invslid", "error", res);

    if (fields?.affectedRows) {
      const data = {
        isDeleted: fields.affectedRows,
      };
      response(200, data, "INI DELETE DATA", res);
    } else {
      response(404, "user not found", "error", res);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
