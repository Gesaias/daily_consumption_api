import { City } from 'src/app/cities/entities/cities.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('airport')
export class Airport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'iata', nullable: false, length: 3 })
  iata: string;

  @Column({ name: 'lat', nullable: false })
  lat: string;

  @Column({ name: 'lon', nullable: false })
  lon: string;

  // Relations

  @ManyToOne(() => City, (city) => city.airports, { eager: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    select: true,
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    select: true,
  })
  public updated_at: Date;
}
