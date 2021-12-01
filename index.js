const fastify = require("fastify")({ logger: true });
const path = require("path");
const PORT = process.env.PORT || 5000;
const multer = require("fastify-multer"); // or import multer from 'fastify-multer'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

fastify.register(require("point-of-view"), {
  engine: {
    ejs: require("ejs"),
  },
  root: path.join(__dirname, "views"),
});

fastify.register(multer.contentParser);

const upload = multer({ storage: storage });

fastify.route({
  method: "POST",
  url: "/upload",
  preHandler: upload.single("avatar"),
  handler: function (request, reply) {
    reply.send({ message: "Image uploaded" });
  },
});

fastify.get("/", async (request, reply) => {
  return reply.view("index.ejs", { title: "All Areas" });
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(PORT);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
