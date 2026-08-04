export interface Baby {
    id: string;

    name: string;

    gender: 'boy' | 'girl';

    birthDate: string;

    weight?: number;

    height?: number;

    bloodGroup?: string;

    photo?: string;
}
