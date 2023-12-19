'use client'
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Code, Copy, Server } from 'lucide-react';
import { Badge, BadgeProps } from "./badge";
import { Button } from "./button";
import toast from "react-hot-toast";

interface ApiAlertInterface{
    title: string;
    description: string;
    variant: 'public' | 'admin';
}

// const textMap: Record<ApiAlertInterface["variant"], string> = {
//   public: 'Public',
//   admin: "Admin",
// }

// const variantMap: Record<ApiAlertInterface["variant"], BadgeProps["variant"]> = {
//   public: "secondary",
//   admin: "descructive",
// }

const ApiAlert: React.FC<ApiAlertInterface> = ({
    title,
    description,
    variant
}) => {

  const audiance= variant === "public" ? "Public" : "Admin"
  const bedgeType: BadgeProps['variant'] = variant === "public" ? "secondary" : "destructive"

  const onCopy = (description: string)=>{
    navigator.clipboard.writeText(description);
    toast.success("API route copied to the clipboard")
  }

  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={bedgeType}>{audiance}</Badge>  
      </AlertTitle>
      
      <AlertDescription className="flex items-center justify-between mt-4">
        <code className="relative rounded bg-muted p-1  font-mono text-sm font-semibold">
          {description}
        </code>
        <Button
        variant={'outline'}
        size={'icon'}
        onClick={()=> onCopy(description)}>
          <Copy className="w-4 h-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export default ApiAlert