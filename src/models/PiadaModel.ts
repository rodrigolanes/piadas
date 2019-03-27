import { Schema, Document, model } from 'mongoose'

interface PiadaInterface extends Document {
  pergunta: string,
  resposta: string,
  votes?: number
}

const PiadaSchema = new Schema({
  pergunta: String,
  resposta: String,
  votes: { type: Number, default: 0 }
}, { timestamps: true })

export default model<PiadaInterface>('Piada', PiadaSchema)
