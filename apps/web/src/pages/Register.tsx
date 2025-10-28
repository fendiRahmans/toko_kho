import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { authService } from '../services/auth'

// Schema validasi menggunakan Zod
const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .min(6, 'Password minimal 6 karakter'),
  confirmPassword: z
    .string()
    .min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password dan konfirmasi password tidak cocok',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

const Register = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      await authService.register({
        email: data.email,
        password: data.password,
      })
      toast.success('Registrasi berhasil! Silakan login.')
      navigate('/')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registrasi gagal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <Card className="w-full backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl p-8 shadow-lg ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Daftar Akun</CardTitle>
          <CardDescription className="text-center">
            Buat akun baru untuk mengakses aplikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email Anda"
                className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                className={errors.password ? 'border-red-500 focus:ring-red-500' : ''}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Konfirmasi password"
                className={errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Mendaftarkan...' : 'Daftar'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
                Login di sini
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
  )
}

export default Register