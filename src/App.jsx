import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useState } from "react";
import z from "zod";

export const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [saida, setSaida] = useState(0);
  const [entrada, setEntrada] = useState(0);

  const schema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    value: z.string().min(1, "Valor deve ser positivo"),
    type: z.enum(["entrada", "saida"], "Tipo é obrigatório"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("data", data);

    const parsedData = schema.safeParse(data);
    console.log("parsedData", parsedData.success);
    if (!parsedData.success) {
      console.error("Validation failed", parsedData.error);
      return;
    }

    const newTransaction = {
      description: data.description,
      value: parseFloat(data.value),
      type: data.type,
    };
    if (data.type === "entrada") {
      setEntrada((prev) => prev + newTransaction.value);
      setTotal((prev) => prev + newTransaction.value);
    }
    if (data.type === "saida") {
      setSaida((prev) => prev + newTransaction.value);
      setTotal((prev) => prev - newTransaction.value);
    }

    setTransactions((prev) => [
      ...prev,
      {
        description: data.description,
        value: parseFloat(data.value),
        type: data.type,
      },
    ]);
    e.target.reset();
    console.log(transactions);
    localStorage.setItem("transactions", JSON.stringify(transactions));
  };

  const removeTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);

    const removedTransaction = transactions[index];
    if (removedTransaction.type === "entrada") {
      setEntrada((prev) => prev - removedTransaction.value);
      setTotal((prev) => prev - removedTransaction.value);
    } else {
      setSaida((prev) => prev - removedTransaction.value);
      setTotal((prev) => prev + removedTransaction.value);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-50 bg-lime-700 text-white">
        <h1 className="text-5xl font-bold">Controle Financeiro</h1>
      </div>

      <div className="flex items-center justify-center h-10 ">
        <Container fixed>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              width: "100%",
              gap: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                padding: 2,
                borderRadius: 1,
                boxShadow: 3,
              }}
            >
              <h2 className="flex items-center gap-2">
                Entrada
                <ArrowCircleUpIcon
                  sx={{ fontSize: 25, color: "green", marginBottom: 1 }}
                />
              </h2>

              <h1 className="text-4xl font-bold">{`R$ ${entrada}`}</h1>
            </Box>
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                padding: 2,
                borderRadius: 1,
                boxShadow: 3,
              }}
            >
              <h2 className="flex items-center gap-2">
                Sainda
                <ArrowCircleDownIcon
                  sx={{ fontSize: 25, color: "red", marginBottom: 1 }}
                />
              </h2>
              <h1 className="text-4xl font-bold">{`R$ ${saida}`}</h1>
            </Box>
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                padding: 2,
                borderRadius: 1,
                boxShadow: 3,
              }}
            >
              <h2 className="flex items-center gap-2">
                Total
                <AttachMoneyIcon
                  sx={{ fontSize: 25, color: "blue", marginBottom: 1 }}
                />
              </h2>
              <h1 className="text-4xl font-bold">{`R$ ${total}`}</h1>
            </Box>
          </Box>
        </Container>
      </div>

      <Container
        fixed
        className="flex flex-row items-center justify-between gap-4 mt-15 border-1 border-gray-300 p-4 rounded-lg shadow-lg"
      >
        <FormControl
          component="form"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <div className="flex items-center justify-center gap-2 pr-4">
            <TextField
              required
              name="description"
              label="Descrição"
              variant="outlined"
              margin="normal"
            />
            <TextField
              required
              name="value"
              label="Valor"
              variant="outlined"
              margin="normal"
              type="number"
              InputProps={{
                startAdornment: <Box sx={{ marginRight: 1 }}>R$</Box>,
              }}
              sx={{ width: 150 }}
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <RadioGroup defaultValue="entrada" row name="type">
              <FormControlLabel
                value="saida"
                control={<Radio />}
                label="Saida"
              />
              <FormControlLabel
                value="entrada"
                control={<Radio />}
                label="Entrada"
              />
            </RadioGroup>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#4CAF50",
                "&:hover": {
                  backgroundColor: "#45a049",
                },
              }}
            >
              Adicionar
            </Button>
          </div>
        </FormControl>
      </Container>

      <Container
        fixed
        className="mt-10 border-1 border-gray-300 p-4 rounded-lg shadow-lg"
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            {transactions.map((transaction, index) => {
              return (
                <TableBody key={index}>
                  <TableRow>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.value}</TableCell>
                    <TableCell>
                      {transaction.type === "entrada" ? (
                        <ArrowCircleUpIcon sx={{ color: "green" }} />
                      ) : (
                        <ArrowCircleDownIcon sx={{ color: "red" }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => removeTransaction(index)}>
                        {<HighlightOffIcon sx={{ color: "red" }} />}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              );
            })}
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};
