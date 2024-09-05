"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@theliaison/ui/button"
import { Input } from "@theliaison/ui/input"
import { Textarea } from "@theliaison/ui/textarea"
import { AlertCircle } from "lucide-react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@theliaison/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@theliaison/ui/select"
//import { Alert, AlertDescription, AlertTitle } from "@theliaison/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@theliaison/ui/card"

const shipmentSchema = z.object({
  senderName: z.string().min(2, { message: "Sender name must be at least 2 characters." }),
  senderAddress: z.string().min(10, { message: "Sender address must be at least 10 characters." }),
  recipientName: z.string().min(2, { message: "Recipient name must be at least 2 characters." }),
  recipientAddress: z.string().min(10, { message: "Recipient address must be at least 10 characters." }),
  packageWeight: z.number().positive({ message: "Weight must be a positive number." }),
  packageDimensions: z.string().regex(/^\d+\s*x\s*\d+\s*x\s*\d+$/, { 
    message: "Dimensions must be in the format L x W x H (e.g., 12 x 8 x 6)." 
  }),
  serviceType: z.enum(["STANDARD_OVERNIGHT", "PRIORITY_OVERNIGHT", "FEDEX_GROUND", "FEDEX_EXPRESS_SAVER"], {
    errorMap: () => ({ message: "Please select a valid service type." })
  }),
})

type ShipmentFormValues = z.infer<typeof shipmentSchema>

export default function SendForm() {
  const form = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      senderName: '',
      senderAddress: '',
      recipientName: '',
      recipientAddress: '',
      packageWeight: undefined,
      packageDimensions: '',
      serviceType: undefined,
    },
  })

  const onSubmit = (data: ShipmentFormValues) => {
    console.log('Form submitted:', data)
    alert('Form submitted. Check console for details.')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create FedEx Shipment</CardTitle>
        <CardDescription>Enter the shipment details to create a new FedEx shipment.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="senderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="senderAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sender Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="123 Sender St, City, State, ZIP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="456 Recipient Ave, City, State, ZIP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="packageWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Weight (lbs)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="packageDimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Dimensions (L x W x H in inches)</FormLabel>
                    <FormControl>
                      <Input placeholder="12 x 8 x 6" {...field} />
                    </FormControl>
                    <FormDescription>Enter dimensions in the format: Length x Width x Height</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STANDARD_OVERNIGHT">Standard Overnight</SelectItem>
                      <SelectItem value="PRIORITY_OVERNIGHT">Priority Overnight</SelectItem>
                      <SelectItem value="FEDEX_GROUND">FedEx Ground</SelectItem>
                      <SelectItem value="FEDEX_EXPRESS_SAVER">FedEx Express Saver</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This form is not connected to the actual FedEx API.
              </AlertDescription>
            </Alert> */}
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full bg-foreground text-background cursor-pointer hover:bg-foreground/80" onClick={form.handleSubmit(onSubmit)}>Create Shipment</Button>
      </CardFooter>
    </Card>
  )
}