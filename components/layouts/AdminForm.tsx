"use client";


import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import { StoreProduct } from "../../ServerActions/StoreProduct";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const FormSchema = z.object({
    ProductName: z.string().min(2, {
        message: "Product name must be at least 2 characters.",
    }),
    ProductDescription: z.string().min(20, {
        message: "Product description must be at least 20 characters.",
    }),
    ProductImage: z
        .any()
        .refine((files) => files?.length === 1, "Image is required.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 3MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png and .webp files are accepted."
        ),
    ProductPrice: z.coerce.number().min(0, { message: "Price should be greater than 0" })
});

export function InputForm() {
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            ProductName: "",
            ProductDescription: "",
            ProductImage: undefined,
            ProductPrice: 0,
        },
    });
    const { formState: { isSubmitting }, reset } = form

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const file = data.ProductImage[0];
            if (!file) {
                throw new Error("File is undefined");
            }
            const binaryFile = await data.ProductImage[0].arrayBuffer();
            const fileBuffer = Buffer.from(binaryFile).toString('base64');
            const response = await axios.post('/api/upload', {
                name: file.name,
                type: file.type,
                fileBuffer: fileBuffer,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (response.status === 200) {
                const productProps = {
                    ProductName: data.ProductName,
                    ProductDescription: data.ProductDescription,
                    ProductPrice: data.ProductPrice,
                    ProductImage: `${process.env.NEXT_PUBLIC_DISTRIBUTION_DOMAIN}/${file.name}`,
                }
                // console.log(productProps);
                await StoreProduct(productProps)
                toast({
                    title: "Product Created",
                    description: "Your product has been created successfully",
                    action: (
                        <Button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            type="submit"
                            onClick={() => redirect('/')}
                        >
                            View Product
                        </Button>
                    ),
                });

            }
            else {
                throw new Error("Upload failed");
            }
            reset();
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="ProductName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Pencil" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display product name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ProductDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Description about the Product." {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public Product Description.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ProductImage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    onChange={(event) => {
                                        field.onChange(event.target.files);
                                    }}
                                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                />
                            </FormControl>
                            <FormDescription>
                                This is your public display image.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ProductPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Price</FormLabel>
                            <FormControl>
                                <Input placeholder="$ 9.99" type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display price.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "loading..." : "Submit"}</Button>
            </form>
        </Form>
    );
}
