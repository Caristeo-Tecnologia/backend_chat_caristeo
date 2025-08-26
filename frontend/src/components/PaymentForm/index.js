import React from "react";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Grid,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { CalendarToday } from "@material-ui/icons";

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
    <Formik
      initialValues={{
        name: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      }}
      validationSchema={paymentSchema}
    >
      {({ touched, values, errors, handleChange }) => (
        <Form onChange={() => onChange(values)}>
          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12} sm={12}>
              <Box>
                <InputLabel>Nome no cartão de crédito</InputLabel>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  onChange={handleChange}
                  value={values.name}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
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
                  value={formatCardNumber(values.cardNumber)}
                  onChange={(e) => {
                    e.target.value = formatCardNumber(e.target.value);
                    handleChange(e)
                  }}
                  error={touched.cardNumber && Boolean(errors.cardNumber)}
                  helperText={touched.cardNumber && errors.cardNumber}
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
                  value={values.expiryDate}
                  onChange={(e) => {
                    e.target.value = formatExpiryDate(e.target.value);
                    handleChange(e);
                  }}
                  error={touched.expiryDate && Boolean(errors.expiryDate)}
                  helperText={touched.expiryDate && errors.expiryDate}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarToday
                          sx={{ color: "#ABABAB", width: "1rem" }}
                        />
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
                  onChange={handleChange}
                  value={values.cvv}
                  error={touched.cvv && Boolean(errors.cvv)}
                  helperText={touched.cvv && errors.cvv}
                  inputProps={{ maxLength: 4 }}
                  placeholder="123"
                  required
                />
              </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
