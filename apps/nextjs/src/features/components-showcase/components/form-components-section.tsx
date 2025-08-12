"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod/v4";

import { ComponentExample } from "./component-example";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  bio: z.string().max(160).optional(),
  notifications: z.boolean().default(false),
  role: z.string(),
});

export function FormComponentsSection() {
  const form = useForm({
    schema: formSchema,
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      notifications: false,
      role: "",
    },
  });

  return (
    <div className="space-y-8">
      {/* Input */}
      <ComponentExample
        title="Input"
        description="Displays a form input field or a component that looks like an input field."
      >
        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default">Default Input</Label>
            <Input id="default" placeholder="Enter text..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled">Disabled Input</Label>
            <Input id="disabled" placeholder="Disabled" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="with-value">Input with Value</Label>
            <Input id="with-value" defaultValue="Hello, World!" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Input</Label>
            <Input id="email" type="email" placeholder="email@example.com" />
          </div>
        </div>
      </ComponentExample>

      {/* Textarea */}
      <ComponentExample
        title="Textarea"
        description="Displays a form textarea or a component that looks like a textarea."
      >
        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a little bit about yourself"
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here."
              rows={5}
            />
          </div>
        </div>
      </ComponentExample>

      {/* Select */}
      <ComponentExample
        title="Select"
        description="Displays a list of options for the user to pick from—triggered by a button."
      >
        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="framework">Framework</Label>
            <Select>
              <SelectTrigger id="framework">
                <SelectValue placeholder="Select a framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="next">Next.js</SelectItem>
                <SelectItem value="remix">Remix</SelectItem>
                <SelectItem value="astro">Astro</SelectItem>
                <SelectItem value="gatsby">Gatsby</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="pst">
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pst">Pacific Standard Time</SelectItem>
                <SelectItem value="est">Eastern Standard Time</SelectItem>
                <SelectItem value="cst">Central Standard Time</SelectItem>
                <SelectItem value="mst">Mountain Standard Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ComponentExample>

      {/* Checkbox */}
      <ComponentExample
        title="Checkbox"
        description="A control that allows the user to toggle between checked and not checked."
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="marketing" defaultChecked />
            <Label
              htmlFor="marketing"
              className="text-sm font-medium leading-none"
            >
              Receive marketing emails
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-check" disabled />
            <Label
              htmlFor="disabled-check"
              className="text-sm font-medium leading-none opacity-70"
            >
              Disabled checkbox
            </Label>
          </div>
        </div>
      </ComponentExample>

      {/* Form Example */}
      <ComponentExample
        title="Form"
        description="Building forms with React Hook Form and Zod validation."
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => console.log(data))}
            className="max-w-md space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can write up to 160 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Email notifications</FormLabel>
                    <FormDescription>
                      Receive emails about your account activity.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </ComponentExample>
    </div>
  );
}
