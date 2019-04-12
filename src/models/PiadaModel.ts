import { Schema, Document, model, Model } from 'mongoose'
import { PiadaInterface } from '../interfaces/Piada'

export interface PiadaModel extends PiadaInterface, Document {
}

const PiadaSchema = new Schema({
  pergunta: { type: String, required: true },
  resposta: { type: String, required: true },
  votes: { type: Number, default: 0 }
}, { timestamps: true })

const Piada: Model<PiadaModel> = model<PiadaModel>('Piada', PiadaSchema)

export default Piada
