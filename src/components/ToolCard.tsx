
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Wrench, Settings, User } from "lucide-react";
import { Tool } from "@/types";

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const getIcon = () => {
    switch (tool.icon) {
      case "calculator":
        return <Calculator className="h-6 w-6 text-eprojects-orange" />;
      case "wrench":
        return <Wrench className="h-6 w-6 text-eprojects-orange" />;
      case "settings":
        return <Settings className="h-6 w-6 text-eprojects-orange" />;
      default:
        return <User className="h-6 w-6 text-eprojects-orange" />;
    }
  };

  return (
    <Card className="glass-card h-full hover:orange-glow transition-all duration-300 overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="p-2 bg-black/30 rounded-md">
            {getIcon()}
          </div>
          {tool.isPro && (
            <span className="px-2 py-1 bg-eprojects-orange text-xs font-bold rounded-full">
              PRO
            </span>
          )}
        </div>
        <CardTitle className="text-xl mt-3 text-eprojects-white">{tool.name}</CardTitle>
        <CardDescription className="text-eprojects-white/70">
          {tool.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter>
        <Button 
          asChild 
          className="w-full bg-eprojects-orange hover:bg-eprojects-orange/80"
        >
          <Link to={tool.link}>
            Acessar
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
