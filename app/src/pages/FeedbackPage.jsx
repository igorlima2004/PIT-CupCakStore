import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Star, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const FeedbackPage = () => {
  const [rating, setRating] = useState([3]); 
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar logado para enviar feedback.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log({ userId: user.id, rating: rating[0], comment });
      toast({
        title: "Feedback Enviado!",
        description: "Obrigado por compartilhar sua opinião conosco!",
        className: "bg-green-500 text-white",
      });
      setRating([3]);
      setComment('');
      setIsSubmitting(false);
    }, 1500);
  };

  const ratingLabels = ["Péssimo", "Ruim", "Regular", "Bom", "Excelente"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-[calc(100vh-250px)] py-12"
    >
      <Card className="w-full max-w-lg shadow-2xl bg-white/90 backdrop-blur-sm border-pink-200">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="mx-auto bg-gradient-to-br from-pink-500 to-rose-500 p-4 rounded-full w-fit mb-4 shadow-lg"
          >
            <MessageSquare size={40} className="text-white" />
          </motion.div>
          <CardTitle className="text-3xl font-fancy text-pink-600">Deixe seu Feedback</CardTitle>
          <CardDescription className="text-pink-500">Sua opinião é muito importante para nós!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="rating" className="text-pink-700 text-lg flex items-center">
                <Star size={20} className="mr-2 text-yellow-400 fill-yellow-400" />
                Sua Avaliação: <span className="ml-2 font-bold text-pink-600">{ratingLabels[rating[0]-1]}</span>
              </Label>
              <div className="flex items-center space-x-2">
                <Slider
                  id="rating"
                  min={1}
                  max={5}
                  step={1}
                  value={rating}
                  onValueChange={setRating}
                  className="[&>span:first-child]:h-3 [&>span:first-child>span]:bg-pink-500 [&>span:last-child]:bg-pink-500 [&>span:last-child]:border-pink-700 [&>span:last-child]:h-5 [&>span:last-child]:w-5"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>Péssimo</span>
                <span>Excelente</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment" className="text-pink-700 text-lg">Seu Comentário</Label>
              <Textarea
                id="comment"
                placeholder="Conte-nos mais sobre sua experiência..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                className="border-pink-300 focus:border-pink-500 focus:ring-pink-500 resize-none"
              />
            </div>
            
            <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white text-lg py-3 transition-all transform hover:scale-105" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : <><Send size={18} className="mr-2"/> Enviar Feedback</>}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center pt-6">
            <p className="text-xs text-gray-500">Agradecemos por dedicar seu tempo para nos ajudar a melhorar!</p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default FeedbackPage;