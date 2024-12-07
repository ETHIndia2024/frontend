'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, Form, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSuiTrueTags } from "@/hooks/useSuiTrueTags";
import { zodResolver } from '@hookform/resolvers/zod';
import { SuiClient } from "@mysten/sui/client";
import { useWallet } from "@suiet/wallet-kit";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


const formSchema = z.object({
  name: z.string(),
  type: z.string(),
  data: z.any().refine((files) => files?.length > 0, "At least one image is required."),
  reward: z.string(),
})

const client = new SuiClient({ 
        url: process.env.NEXT_PUBLIC_SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443' 
});

const FIXED_PAYMENT = 0.001;
  
export default function UploadPage() {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const { createTask } = useSuiTrueTags(client);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: '',
      data: '',
      reward: '',
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('values:', values);
    try{
      setIsLoading(true);
      const files = values.data as FileList;
  
      const blobs = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const blob = new Blob([file], { type: file.type });
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_PUBLISHER}/v1/store?epochs=1`, {
            method: 'PUT',
            body: blob,
            headers: {
              'Content-Type': file.type,
            },
          });
  
          const result = await response.json();
          if(result.alreadyCertified.blobId){
            blobs.push(result.alreadyCertified.blobId);
          }else if(result.newlyCreated.blobObject.blobId){
            blobs.push(result.newlyCreated.blobObject.blobId);
          }
  
          if (!response.ok) {
            throw new Error(`Upload failed for ${file.name}`);
          }
  
          console.log(`Uploaded ${file.name} successfully`);
        } catch (error) {
          console.error(`Upload error for ${file.name}:`, error);
          return;
        }
      }
      if (wallet.account?.address) {
        // const id = parseInt(crypto.randomUUID().slice(0, 8), 16);
        // const txn = await createTask(
        //   id, //id
        //   values.name, //name
        //   FIXED_PAYMENT, //reward per annotation
        //   Math.floor(Number(values.reward) / FIXED_PAYMENT), //required annotations
        // );
        // console.log('Transaction executed:', txn);

        const res = await fetch('/api/job/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: values.name, type: values.type, data: blobs, reward: values.reward, publisher: wallet.account?.address })
        })
        const data = await res.json()
        console.log('data:', data);
      }
    }
    catch (error) {
      console.error('Error uploading dataset:', error)
    }finally{
      setIsLoading(false);
    }
  }


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Upload New Dataset</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Dataset Information</CardTitle>
          <CardDescription>Provide details about the dataset you re uploading.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          <Form  {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-2">
                      <Label htmlFor="name">Dataset Name</Label>
                      <FormControl>
                        <Input id="name" placeholder="Enter dataset name" {...field} />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-2">
                      <Label htmlFor="type">Dataset Type</Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dataset type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectContent>
                            <SelectItem value="images">Images</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                          </SelectContent>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="data"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-2">
                      <Label htmlFor="data">Dataset File</Label>
                      <FormControl>
                        <Input
                          id="images"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="reward"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-2">
                      <Label htmlFor="reward">Reward</Label>
                      <FormControl>
                        <Input id="reward" placeholder="Enter reward amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <Button className="w-full" >
                {isLoading ? 'Uploading...' : 'Upload'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

