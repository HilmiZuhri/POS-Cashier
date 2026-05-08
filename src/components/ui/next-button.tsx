import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface NextButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading?: boolean;
}

const NextButton = ({ onClick, disabled, loading }: NextButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 px-3"
      disabled={disabled || loading}
      onClick={onClick}
    >
      Next
      <ChevronRight className="h-4 w-4 ml-1" />
    </Button>
  );
};

export default NextButton;