require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const jwt = require("jsonwebtoken");

const schema = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const providerRoutes = require('./routes/providerRoutes');

const { sequelize } = require("./models");

const app = express();

// ✅ FIXED — cors and json MUST come before routes
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// ✅ FIXED — routes after middleware
app.use('/api/provider', providerRoutes);

const ensureUserRoleCompositeUnique = async () => {
  const queryInterface = sequelize.getQueryInterface();

  try {
    const indexes = await queryInterface.showIndex("Users");

    for (const index of indexes) {
      const fieldNames = (index.fields || []).map((field) => field.attribute || field.name);
      const isEmailOnlyUnique = index.unique && fieldNames.length === 1 && fieldNames[0] === "email";

      if (isEmailOnlyUnique) {
        await queryInterface.removeIndex("Users", index.name);
      }
    }

    const refreshedIndexes = await queryInterface.showIndex("Users");
    const hasComposite = refreshedIndexes.some((index) => {
      const fieldNames = (index.fields || []).map((field) => field.attribute || field.name);
      return index.unique && fieldNames.length === 2 && fieldNames.includes("email") && fieldNames.includes("role");
    });

    if (!hasComposite) {
      await queryInterface.addIndex("Users", ["email", "role"], {
        unique: true,
        name: "users_email_role_unique"
      });
    }
  } catch (err) {
    console.log("Index migration warning:", err.message);
  }
};

app.get("/", (req, res) => {
  res.send("KaamOnClick Backend Running");
});

app.use(
  "/graphql",
  graphqlHTTP((req) => {
    let user = null;

    const token = req.headers.authorization;

    if (token) {
      try {
        user = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        console.log("Invalid token");
      }
    }

    return {
      schema: schema,
      rootValue: resolvers,
      graphiql: true,
      context: { user, req }  // ✅ FIXED — added req to context for admin resolvers
    };
  })
);

sequelize.sync({ alter: true }).then(async () => {
  await ensureUserRoleCompositeUnique();
  console.log("Database synced");
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});