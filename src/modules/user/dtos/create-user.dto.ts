import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { trimmer } from 'src/common/validators/trim.transform';

export class CreateUserDto {
  @Transform(trimmer)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(trimmer)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Transform(trimmer)
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/, { 
    message: 'Password must contain at least 8 characters, one lowercase letter and one digit.',
  })
  password: string;

  registrationConfirmationToken: string; // Include this field for registration confirmation
  
  registrationConfirmationStatus: boolean; // Include this field for registration confirmation

}