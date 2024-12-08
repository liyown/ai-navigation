"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { categoriesAtom, isAdminModeAtom } from '@/lib/atoms';
import { addWebsite, getCategories } from '@/lib/db';
import { fetchMetadata } from '@/lib/metadata';
import { websiteFormSchema } from '@/lib/validations';
import { FormField } from './form-field';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { FormInputs } from '@/lib/types';

export function WebsiteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [isAdmin] = useAtom(isAdminModeAtom);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // 确保分类数据已加载
    const loadCategories = () => {
      const categoryData = getCategories();
      setCategories(categoryData);
    };
    
    if (categories.length === 0) {
      loadCategories();
    }
  }, [categories.length, setCategories]);

  const form = useForm<FormInputs>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
      category_id: '',
      thumbnail: '',
    },
  });

  const { watch, setValue } = form;
  const url = watch('url');
  const isValidUrl = url && url.startsWith('http');

  const fetchWebsiteMetadata = async () => {
    if (!isValidUrl) return;
    
    setIsFetching(true);
    try {
      const metadata = await fetchMetadata(url);
      if (metadata.title) setValue('title', metadata.title);
      if (metadata.description) setValue('description', metadata.description);
      if (metadata.image) setValue('thumbnail', metadata.image);
      
      toast({
        title: '获取成功',
        description: '网站信息已自动填充',
      });
    } catch (error) {
      toast({
        title: '获取元数据失败',
        description: '请手动填写网站信息',
        variant: 'destructive',
      });
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (values: FormInputs) => {
    if (!values.category_id) {
      toast({
        title: '请选择分类',
        description: '网站分类不能为空',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addWebsite({
        ...values,
        category_id: parseInt(values.category_id),
        // 如果是管理员提交，直接设置为已通过状态
        status: isAdmin ? 'approved' : 'pending',
      });

      toast({
        title: '提交成功！',
        description: isAdmin ? '网站已添加到已通过列表。' : '您的网站已提交审核。',
      });

      // 管理员提交后跳转到管理页面，普通用户跳转到首页
      router.push(isAdmin ? '/admin' : '/');
    } catch (error) {
      toast({
        title: '错误',
        description: '提交失败，请重试。',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <FormField
          label="网站地址"
          name="url"
          form={form}
          placeholder="https://example.com"
        />
        <Button
          type="button"
          variant="outline"
          onClick={fetchWebsiteMetadata}
          disabled={!isValidUrl || isFetching || isSubmitting}
          className="w-full"
        >
          {isFetching ? '获取中...' : '自动获取网站信息'}
        </Button>
      </div>

      <FormField
        label="网站标题"
        name="title"
        form={form}
        placeholder="输入网站标题"
      />

      <FormField
        label="网站描述"
        name="description"
        form={form}
        placeholder="描述这个网站"
        textarea
      />

      <div>
        <label className="block text-sm font-medium mb-2">
          分类
        </label>
        <Select
          onValueChange={(value) => setValue('category_id', value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.category_id && (
          <p className="text-sm text-red-500 mt-1">
            请选择网站分类
          </p>
        )}
      </div>

      <FormField
        label="缩略图地址（可选）"
        name="thumbnail"
        form={form}
        placeholder="https://example.com/thumbnail.jpg"
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? '提交中...' : '提交网站'}
      </Button>
    </form>
  );
}