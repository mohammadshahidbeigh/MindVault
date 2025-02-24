import React, {useState, useEffect} from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  Grid,
  Fade,
  useTheme,
} from "@mui/material";
import {useDispatch} from "react-redux";
import {useNavigate, Link} from "react-router-dom";
import {useSnackbar} from "notistack";
import {Formik, Form, Field} from "formik";
import * as Yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {registerUser} from "../../store/userSlice";
import {AppDispatch} from "../../store";
import xss from "xss";

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
});

const Signup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addListener(handleChange);
    return () => darkModeMediaQuery.removeListener(handleChange);
  }, []);

  const handleSignup = (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    const sanitizedValues = {
      name: xss(values.name),
      email: xss(values.email),
      password: values.password, // Passwords should not be sanitized
    };

    dispatch(registerUser(sanitizedValues))
      .unwrap()
      .then(() => {
        enqueueSnackbar("Signup successful", {variant: "success"});
        navigate("/dashboard");
      })
      .catch((error: string) => {
        enqueueSnackbar(error, {variant: "error"});
      });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        marginLeft: {xs: 0, sm: "240px"},
        width: {xs: "100%", sm: "calc(100% - 240px)"},
        backgroundColor: isDarkMode
          ? theme.palette.background.default
          : theme.palette.background.paper,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={6}
            sx={{
              p: {xs: 2, sm: 3},
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: "12px",
              background: isDarkMode
                ? theme.palette.background.paper
                : theme.palette.background.default,
              backdropFilter: "blur(10px)",
              boxShadow: theme.shadows[6],
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: "secondary.main",
                width: 40,
                height: 40,
              }}
            >
              <LockOutlinedIcon fontSize="small" />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="primary"
            >
              Sign up
            </Typography>
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={SignupSchema}
              onSubmit={handleSignup}
            >
              {({errors, touched}) => (
                <Form style={{width: "100%"}}>
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    name="name"
                    label="Full Name"
                    variant="outlined"
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    size="small"
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    name="email"
                    label="Email Address"
                    variant="outlined"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    size="small"
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    error={touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <VisibilityOffIcon fontSize="small" />
                            ) : (
                              <VisibilityIcon fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Field
                    as={TextField}
                    fullWidth
                    margin="normal"
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    variant="outlined"
                    error={touched.confirmPassword && !!errors.confirmPassword}
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleToggleConfirmPasswordVisibility}
                            edge="end"
                            size="small"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOffIcon fontSize="small" />
                            ) : (
                              <VisibilityIcon fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    size="medium"
                    sx={{
                      mt: 2,
                      mb: 2,
                      borderRadius: "20px",
                      py: 1,
                    }}
                  >
                    Sign Up
                  </Button>
                  <Grid container justifyContent="center">
                    <Grid item>
                      <Typography variant="body2" align="center">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          style={{
                            textDecoration: "none",
                            color: theme.palette.primary.main,
                            fontWeight: "bold",
                          }}
                        >
                          Log In
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Signup;
