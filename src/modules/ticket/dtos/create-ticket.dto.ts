import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { trimmer } from 'src/common/validators/trim.transform';

export class CreateTicketDto {
  status: string;

  @Transform(trimmer)
  @IsString()
  @IsNotEmpty()
  priority: string;

  @Transform(trimmer)
  @IsString()
  @IsNotEmpty()
  category: string;

  @Transform(trimmer)
  @IsString()
  @IsNotEmpty()
  title: string;

  @Transform(trimmer)
  @IsString()
  @IsNotEmpty()
  description: string;

  scheduled_date: Date;
}
