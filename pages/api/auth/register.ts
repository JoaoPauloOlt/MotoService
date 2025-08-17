import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    await dbConnect()

    const { name, email, password, phone } = req.body

    // Validações
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres' })
    }

    // Verificar se o email já existe
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: 'Este email já está cadastrado' })
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim()
    })

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Retornar dados do usuário (sem senha) e token
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt
    }

    res.status(201).json({
      message: 'Usuário criado com sucesso!',
      user: userResponse,
      token
    })

  } catch (error) {
    console.error('Erro no registro:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
