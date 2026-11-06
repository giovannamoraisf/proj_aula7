import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transacao, TransacaoDocument } from './schemas/transacao.schema';
import { CreateTransacaoDto } from './dto/create-transacao.dto';

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel(Transacao.name)
    private transacaoModel: Model<TransacaoDocument>,
  ) {}

  async criar(dados: CreateTransacaoDto) {
    const novaTransacao = new this.transacaoModel(dados);
    return novaTransacao.save();
  }

  async listar() {
    const historico = await this.transacaoModel.find().exec();

    let saldoTotal = 0;
    let totalDespesas = 0;
    let totalGastoImpulso = 0;

    for (const transacao of historico) {
      if (transacao.tipo === 'receita') {
        saldoTotal += transacao.valor;
      } else {
        saldoTotal -= transacao.valor;
        totalDespesas += transacao.valor;

        if (transacao.consumoConsciente === false) {
          totalGastoImpulso += transacao.valor;
        }
      }
    }

    return {
      historico,
      metricas: {
        saldoTotal,
        totalDespesas,
        totalGastoImpulso,
      },
    };
  }
}