const zod = require("zod");

const validData = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6).max(20),
});

async function inputValidation(req, res, next) {
  const signUpData = req.body;

  const result = validData.safeParse(signUpData);

  if (!result.success) {
    const errs = result.error.issues.map((issue) => issue.message);
    return res.json({ Errors: errs });
  }

  next();
}

module.exports = inputValidation;
