import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, FileText, Plus, Minus, ArrowUp, ArrowDown, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { getOpenAIResponse } from '../OpenAIIntegration';

interface Argument {
  id: string;
  text: string;
  type: 'pro' | 'con';
  strength: number;
}

const ArgumentBuilder = () => {
  const [topic, setTopic] = useState('');
  const [arguments, setArguments] = useState<Argument[]>([]);
  const [newArgumentText, setNewArgumentText] = useState('');
  const [newArgumentType, setNewArgumentType] = useState<'pro' | 'con'>('pro');
  const [isGenerating, setIsGenerating] = useState(false);

  const addArgument = () => {
    if (!newArgumentText.trim()) {
      toast({
        title: "Missing Argument",
        description: "Please enter an argument before adding.",
        variant: "destructive",
      });
      return;
    }

    const newArgument: Argument = {
      id: Date.now().toString(),
      text: newArgumentText,
      type: newArgumentType,
      strength: 50,
    };

    setArguments([...arguments, newArgument]);
    setNewArgumentText('');
  };

  const removeArgument = (id: string) => {
    setArguments(arguments.filter((arg) => arg.id !== id));
  };

  const updateArgumentStrength = (id: string, newStrength: number) => {
    setArguments(
      arguments.map((arg) =>
        arg.id === id ? { ...arg, strength: newStrength } : arg
      )
    );
  };

  const generateAIArguments = async () => {
    if (!topic.trim()) {
      toast({
        title: "Missing Topic",
        description: "Please enter a topic before generating arguments.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = `Generate pro and con arguments for the topic: ${topic}. Provide each argument with a brief explanation.`;
      const aiResponse = await getOpenAIResponse(prompt);

      // Parse AI response and add arguments
      const parsedArguments = aiResponse.split('\n').map((line) => {
        const parts = line.split(':');
        if (parts.length === 2) {
          const type = parts[0].trim().toLowerCase().includes('pro') ? 'pro' : 'con';
          const text = parts[1].trim();
          return {
            id: Date.now().toString(),
            text: text,
            type: type,
            strength: 50,
          };
        }
        return null;
      }).filter(arg => arg !== null) as Argument[];

      setArguments([...arguments, ...parsedArguments]);
      toast({
        title: "AI Arguments Generated",
        description: "Arguments have been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating arguments:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating arguments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="shadow-sm dark:shadow-zinc-800/10">
      <CardHeader>
        <CardTitle>Argument Builder</CardTitle>
        <CardDescription>
          Build pro and con arguments for a given topic.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            placeholder="Enter the topic for argument building"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <Button
          onClick={generateAIArguments}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Scale className="mr-2 h-4 w-4" />
              Generate AI Arguments
            </>
          )}
        </Button>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="new-argument">New Argument</Label>
          <div className="flex space-x-2">
            <Textarea
              id="new-argument"
              placeholder="Enter a new argument"
              value={newArgumentText}
              onChange={(e) => setNewArgumentText(e.target.value)}
              className="flex-1"
            />
            <Select onValueChange={(value) => setNewArgumentType(value as 'pro' | 'con')}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="con">Con</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addArgument}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {arguments.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Arguments</h3>
            <ul className="space-y-2">
              {arguments.map((arg) => (
                <li key={arg.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge variant={arg.type === 'pro' ? 'success' : 'destructive'}>
                        {arg.type === 'pro' ? 'Pro' : 'Con'}
                      </Badge>
                      <p>{arg.text}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArgument(arg.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Label>Strength</Label>
                    <div className="flex items-center space-x-2">
                      <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={arg.strength}
                        onChange={(e) => {
                          const newStrength = Math.max(0, Math.min(100, Number(e.target.value)));
                          updateArgumentStrength(arg.id, newStrength);
                        }}
                        className="w-20"
                      />
                      <ArrowUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArgumentBuilder;
