
import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

const EngineeringCalculator = () => {
  const [value1, setValue1] = useState<string>("");
  const [value2, setValue2] = useState<string>("");
  const [operation, setOperation] = useState<string>("add");
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);

    if (isNaN(num1) || isNaN(num2)) {
      setResult(null);
      return;
    }

    let calculatedResult: number;
    switch (operation) {
      case "add":
        calculatedResult = num1 + num2;
        break;
      case "subtract":
        calculatedResult = num1 - num2;
        break;
      case "multiply":
        calculatedResult = num1 * num2;
        break;
      case "divide":
        calculatedResult = num2 !== 0 ? num1 / num2 : NaN;
        break;
      case "power":
        calculatedResult = Math.pow(num1, num2);
        break;
      case "root":
        calculatedResult = Math.pow(num1, 1 / num2);
        break;
      case "log":
        calculatedResult = Math.log(num1) / Math.log(num2);
        break;
      default:
        calculatedResult = 0;
    }

    setResult(calculatedResult);
  };

  const formatResult = (value: number) => {
    if (isNaN(value)) return "Erro na operação";
    return value.toPrecision(10).replace(/\.?0+$/, "");
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-eprojects-white flex items-center gap-2">
              <Calculator className="h-8 w-8 text-eprojects-orange" />
              Calculadora de Engenharia
            </h1>
            <p className="text-eprojects-white/70 mt-2">
              Realize cálculos avançados para projetos de engenharia
            </p>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-eprojects-white">Cálculo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value1" className="text-eprojects-white">Valor 1</Label>
                  <Input
                    id="value1"
                    type="number"
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                    className="bg-black/50 border-white/20 text-eprojects-white"
                    placeholder="Digite o primeiro valor"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="value2" className="text-eprojects-white">Valor 2</Label>
                  <Input
                    id="value2"
                    type="number"
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                    className="bg-black/50 border-white/20 text-eprojects-white"
                    placeholder="Digite o segundo valor"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="operation" className="text-eprojects-white">Operação</Label>
                <select
                  id="operation"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-white/20 text-eprojects-white rounded-md focus:outline-none focus:ring-2 focus:ring-eprojects-orange"
                >
                  <option value="add">Adição (+)</option>
                  <option value="subtract">Subtração (-)</option>
                  <option value="multiply">Multiplicação (×)</option>
                  <option value="divide">Divisão (÷)</option>
                  <option value="power">Potência (x^y)</option>
                  <option value="root">Raiz (x^(1/y))</option>
                  <option value="log">Logaritmo (log_y(x))</option>
                </select>
              </div>
              
              <Button 
                onClick={handleCalculate}
                className="w-full bg-eprojects-orange hover:bg-eprojects-orange/90"
              >
                Calcular
              </Button>
              
              {result !== null && (
                <div className="p-4 bg-black/40 rounded-md mt-4">
                  <h3 className="text-eprojects-white font-medium mb-1">Resultado:</h3>
                  <p className="text-2xl font-bold text-eprojects-orange">
                    {formatResult(result)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EngineeringCalculator;
