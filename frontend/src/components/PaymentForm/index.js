import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Grid,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { CalendarToday, CreditCard } from "@material-ui/icons";

const paymentSchema = Yup.object({
  cardNumber: Yup.string()
    // .matches(/^[0-9]{16}$/, "Invalid card number")
    .required("Card number is required"),
  // expiryDate: yup.string().required("Expiry date is required"),
  expiryDate: Yup.string()
    .required("Expiry date is required")
    .test("valid-month", "Invalid month", function (value) {
      if (!value) {
        return false;
      }

      const [month] = value.split("/").map((item) => parseInt(item, 10));

      return month >= 1 && month <= 12;
    })
    .test(
      "is-future-date",
      "Expiry date must be in the future",
      function (value) {
        if (!value) {
          return false;
        }

        const currentDate = new Date();
        const [month, year] = value
          .split("/")
          .map((item) => parseInt(item, 10));

        // Adding 1 to the month because JavaScript months are zero-indexed
        const expiryDate = new Date(year + 2000, month, 1);

        return expiryDate > currentDate;
      }
    ),
  name: Yup.string().required("Name is required"),
  cvv: Yup.string()
    .matches(/^[0-9]{3,4}$/, "Invalid CVV")
    .required("CVV is required"),
});

export const PaymentForm = ({ onChange }) => {
  // Formik hook and form submission logic
  const formik = useFormik({
    initialValues: {
      name: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    validationSchema: paymentSchema
  });

  // Formatting functions
  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiryDate = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Limit to four numeric characters
    const formattedValue = numericValue.slice(0, 6);

    // Add the '/' separator after the first two characters
    if (formattedValue.length > 2) {
      return formattedValue.slice(0, 2) + " / " + formattedValue.slice(2);
    } else {
      return formattedValue;
    }
  };

  return (
    <Grid container xs={12}>
      <form onChange={onChange(formik.values)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Box>
              <InputLabel>Nome no cartão de crédito</InputLabel>
              <TextField
                fullWidth
                id="name"
                name="name"
                value={formik.values.name}
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                placeholder="Antônio Oliveira"
                required
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box>
              <InputLabel>Número do cartão de crédito</InputLabel>
              <TextField
                fullWidth
                id="cardNumber"
                name="cardNumber"
                value={formatCardNumber(formik.values.cardNumber)}
                onChange={(e) => {
                  e.target.value = formatCardNumber(e.target.value);
                  formik.handleChange(e);
                }}
                error={
                  formik.touched.cardNumber && Boolean(formik.errors.cardNumber)
                }
                helperText={
                  formik.touched.cardNumber && formik.errors.cardNumber
                }
                sx={{
                  "& .MuiInputBase-root": {
                    paddingLeft: "8px",
                  },
                }}
                inputProps={{ maxLength: 19 }}
                placeholder="0000 0000 0000 0000"
                required
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Data de expiração</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              id="expiryDate"
              name="expiryDate"
              value={formik.values.expiryDate}
              onChange={(e) => {
                e.target.value = formatExpiryDate(e.target.value);
                formik.handleChange(e);
              }}
              error={
                formik.touched.expiryDate && Boolean(formik.errors.expiryDate)
              }
              helperText={formik.touched.expiryDate && formik.errors.expiryDate}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarToday sx={{ color: "#ABABAB", width: "1rem" }} />
                  </InputAdornment>
                ),
              }}
              placeholder="MM/YYYY"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>CVV</InputLabel>
            <TextField
              variant="outlined"
              fullWidth
              id="cvv"
              name="cvv"
              value={formik.values.cvv}
              onChange={formik.handleChange}
              error={formik.touched.cvv && Boolean(formik.errors.cvv)}
              helperText={formik.touched.cvv && formik.errors.cvv}
              inputProps={{ maxLength: 4 }}
              placeholder="123"
              required
            />
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};
