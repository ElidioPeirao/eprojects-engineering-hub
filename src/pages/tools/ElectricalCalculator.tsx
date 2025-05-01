
import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench } from "lucide-react";

const ElectricalCalculator = () => {
  // Calculadora Ohm
  const [voltage, setVoltage] = useState<string>("");
  const [current, setCurrent] = useState<string>("");
  const [resistance, setResistance] = useState<string>("");
  const [ohmResult, setOhmResult] = useState<string>("");
  
  // Calculadora Potência
  const [voltagePower, setVoltagePower] = useState<string>("");
  const [currentPower, setCurrentPower] = useState<string>("");
  const [resistancePower, setResistancePower] = useState<string>("");
  const [powerResult, setPowerResult] = useState<string>("");

  const calculateOhm = () => {
    const v = parseFloat(voltage);
    const i = parseFloat(current);
    const r = parseFloat(resistance);

    try {
      if (!isNaN(v) && !isNaN(i) && isNaN(r)) {
        // Calcular R = V / I
        const calculatedR = v / i;
        setOhmResult(`Resistência = ${calculatedR.toFixed(2)} Ω`);
      } else if (!isNaN(v) && isNaN(i) && !isNaN(r)) {
        // Calcular I = V / R
        const calculatedI = v / r;
        setOhmResult(`Corrente = ${calculatedI.toFixed(2)} A`);
      } else if (isNaN(v) && !isNaN(i) && !isNaN(r)) {
        // Calcular V = I * R
        const calculatedV = i * r;
        setOhmResult(`Tensão = ${calculatedV.toFixed(2)} V`);
      } else {
        setOhmResult("Preencha exatamente dois campos para calcular o terceiro");
      }
    } catch (error) {
      setOhmResult("Erro no cálculo");
    }
  };

  const calculatePower = () => {
    const v = parseFloat(voltagePower);
    const i = parseFloat(currentPower);
    const r = parseFloat(resistancePower);

    try {
      if (!isNaN(v) && !isNaN(i)) {
        // P = V * I
        const power = v * i;
        setPowerResult(`Potência = ${power.toFixed(2)} W`);
      } else if (!isNaN(v) && !isNaN(r)) {
        // P = V² / R
        const power = Math.pow(v, 2) / r;
        setPowerResult(`Potência = ${power.toFixed(2)} W`);
      } else if (!isNaN(i) && !isNaN(r)) {
        // P = I² * R
        const power = Math.pow(i, 2) * r;
        setPowerResult(`Potência = ${power.toFixed(2)} W`);
      } else {
        setPowerResult("Preencha pelo menos dois campos para calcular");
      }
    } catch (error) {
      setPowerResult("Erro no cálculo");
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-eprojects-white flex items-center gap-2">
              <Wrench className="h-8 w-8 text-eprojects-orange" />
              Calculadora Elétrica
            </h1>
            <p className="text-eprojects-white/70 mt-2">
              Ferramentas para cálculos elétricos
            </p>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-eprojects-white">Escolha o Cálculo</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="ohm" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="ohm" className="data-[state=active]:bg-eprojects-orange">Lei de Ohm</TabsTrigger>
                  <TabsTrigger value="power" className="data-[state=active]:bg-eprojects-orange">Potência</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ohm" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="voltage" className="text-eprojects-white">Tensão (V)</Label>
                      <Input
                        id="voltage"
                        type="number"
                        placeholder="Deixe em branco para calcular"
                        value={voltage}
                        onChange={(e) => setVoltage(e.target.value)}
                        className="bg-black/50 border-white/20 text-eprojects-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="current" className="text-eprojects-white">Corrente (A)</Label>
                      <Input
                        id="current"
                        type="number"
                        placeholder="Deixe em branco para calcular"
                        value={current}
                        onChange={(e) => setCurrent(e.target.value)}
                        className="bg-black/50 border-white/20 text-eprojects-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resistance" className="text-eprojects-white">Resistência (Ω)</Label>
                      <Input
                        id="resistance"
                        type="number"
                        placeholder="Deixe em branco para calcular"
                        value={resistance}
                        onChange={(e) => setResistance(e.target.value)}
                        className="bg-black/50 border-white/20 text-eprojects-white"
                      />
                    </div>
                    
                    <Button 
                      onClick={calculateOhm}
                      className="w-full bg-eprojects-orange hover:bg-eprojects-orange/90"
                    >
                      Calcular
                    </Button>
                    
                    {ohmResult && (
                      <div className="p-4 bg-black/40 rounded-md mt-4">
                        <p className="text-xl font-bold text-eprojects-orange">{ohmResult}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="power" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="voltagePower" className="text-eprojects-white">Tensão (V)</Label>
                      <Input
                        id="voltagePower"
                        type="number"
                        placeholder="Digite a tensão"
                        value={voltagePower}
                        onChange={(e) => setVoltagePower(e.target.value)}
                        className="bg-black/50 border-white/20 text-eprojects-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPower" className="text-eprojects-white">Corrente (A)</Label>
                      <Input
                        id="currentPower"
                        type="number"
                        placeholder="Digite a corrente"
                        value={currentPower}
                        onChange={(e) => setCurrentPower(e.target.value)}
                        className="bg-black/50 border-white/20 text-eprojects-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resistancePower" className="text-eprojects-white">Resistência (Ω)</Label>
                      <Input
                        id="resistancePower"
                        type="number"
                        placeholder="Digite a resistência"
                        value={resistancePower}
                        onChange={(e) => setResistancePower(e.target.value)}
                        className="bg-black/50 border-white/20 text-eprojects-white"
                      />
                    </div>
                    
                    <Button 
                      onClick={calculatePower}
                      className="w-full bg-eprojects-orange hover:bg-eprojects-orange/90"
                    >
                      Calcular Potência
                    </Button>
                    
                    {powerResult && (
                      <div className="p-4 bg-black/40 rounded-md mt-4">
                        <p className="text-xl font-bold text-eprojects-orange">{powerResult}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ElectricalCalculator;
