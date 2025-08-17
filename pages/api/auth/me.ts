import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../lib/mongodb'
import User from '../../../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    // Verificar token no header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token não fornecido' })
    }

    const token = authHeader.substring(7) // Remove 'Bearer '

    // Verificar e decodificar token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    
    await dbConnect()

    // Buscar usuário
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' })
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token inválido' })
    }
    
    console.error('Erro ao verificar autenticação:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
