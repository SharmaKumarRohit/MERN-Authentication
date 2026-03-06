import yup from "yup";

export const userSchema = yup.object({
  username: yup
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long.")
    .max(25, "Username maximum 25 characters long.")
    .required(),
  email: yup.string().email("Please enter a valid email.").required(),
  password: yup
    .string()
    .min(8, "Password must be at least 8 charcaters long.")
    .required(),
});

export const validateUser = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
};
