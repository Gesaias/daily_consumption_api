import { IsString } from "class-validator";

export class UpdateStatusAirportsDto {
    @IsString()
    description: string;
}
