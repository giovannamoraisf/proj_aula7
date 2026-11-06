import { PartialType } from '@nestjs/mapped-types';
import { CreateTransacaoDto } from './create-transacao.dto';

export class UpdateTransacoeDto extends PartialType(CreateTransacaoDto) {}
