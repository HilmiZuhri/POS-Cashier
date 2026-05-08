import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface PrevButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading?: boolean;
}

const PrevButton = ({ onClick, disabled, loading }: PrevButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 px-3"
      disabled={disabled || loading}
      onClick={onClick}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Prev
    </Button>
  );
};

export default PrevButton;