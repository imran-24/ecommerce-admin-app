import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ModalProps{
    isOpen: boolean,
    title: string,
    description: string,
    onClose: ()=> void,
    children: React.ReactNode
}
const Modal: React.FC<ModalProps > = ({
    isOpen,
    children,
    description,
    onClose,
    title
}) =>{
  return (
    <Dialog 
    open={isOpen} 
    onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div>
            {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Modal