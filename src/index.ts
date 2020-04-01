export interface IWeapon {
  getDamage(): number;
}

export interface IWarrior {
  readonly name: string;
  getWeapon(): IWeapon;
  attack(warrior: IWarrior): void;
}

export class Sword implements IWeapon {
  constructor(private twoHanded = false) {}

  getDamage(): number {
    if (this.twoHanded) {
      return 60 * 2;
    }
    return 60;
  }
}

export class Bow implements IWeapon {
  getDamage(): number {
    return 80;
  }
}

export class Crossbow implements IWeapon {
  getDamage(): number {
    return 120;
  }
}

export class Spear implements IWeapon {
  getDamage(): number {
    return 100;
  }
}

export class Horse {
  constructor(public readonly speed: number) {}
}

export class Swordsman implements IWarrior {
  readonly name: string = "Swordsman";
  private readonly _sword: Sword;

  constructor(sword: Sword) {
    this._sword = sword;
  }

  attack(warrior: IWarrior): void {
    console.log(
      `Swordsman attacks ${warrior.name}. Damage: ${this._sword.getDamage()}`
    );
  }

  getWeapon(): IWeapon {
    return this._sword;
  }
}

export class Archer implements IWarrior {
  readonly name: string = "Archer";

  private readonly _bow: Bow;
  private readonly _quiverCapacity: number;

  private _arrows: number;

  constructor(bow: Bow, quiverCapacity: number) {
    this._bow = bow;
    this._quiverCapacity = quiverCapacity;
    this._arrows = quiverCapacity;
  }

  attack(warrior: IWarrior): void {
    if (this._arrows === 0) {
      console.log("No arrows");
      return;
    }

    console.log(
      `Archer attacks ${warrior.name}. Damage: ${this._bow.getDamage()}`
    );
    this._arrows -= 1;
  }

  getWeapon(): IWeapon {
    return this._bow;
  }
}

export class Crossbowman implements IWarrior {
  readonly name: string = "Crossbowman";

  private readonly _crossbow: Bow;
  private readonly _quiverCapacity: number;
  private _bolts: number;

  constructor(crossbow: Crossbow, quiverCapacity: number) {
    this._crossbow = crossbow;
    this._quiverCapacity = quiverCapacity;
    this._bolts = quiverCapacity;
  }

  attack(warrior: IWarrior): void {
    if (this._bolts === 0) {
      console.log("No bolts");
      return;
    }

    console.log(
      `Crossbowman attacks ${
        warrior.name
      }. Damage: ${this._crossbow.getDamage()}`
    );
    this._bolts -= 1;
  }

  getWeapon(): IWeapon {
    return this._crossbow;
  }
}

export class Spearman implements IWarrior {
  readonly name: string = "Spearman";

  private readonly _spear: Spear;

  constructor(spear: Spear) {
    this._spear = spear;
  }

  attack(warrior: IWarrior): void {
    console.log(
      `Spearman attacks ${warrior.name}. Damage: ${this._spear.getDamage()}`
    );
  }

  getWeapon(): IWeapon {
    return this._spear;
  }
}

export class Knight implements IWarrior {
  readonly name: string = "Knight";

  private readonly _spear: Spear;
  private readonly _horse: Horse;

  constructor(spear: Spear, horse: Horse) {
    this._spear = spear;
    this._horse = horse;
  }

  getWeapon(): IWeapon {
    return this._spear;
  }

  attack(warrior: IWarrior): void {
    console.log(`Knight attacks ${warrior.name}. Damage: ${this._spear.getDamage() + this._horse.speed}`)
  }
}

interface IBuilder<T> {
  reset(): void;
  getResult(): T;
}

interface ISwordsmanBuilder extends IBuilder<Swordsman> {
  setSword(sword: Sword): void;
}

interface IArcherBuilder extends IBuilder<Archer> {
  setBow(bow: Bow): void;
  setQuiverCapacity(capacity: number): void;
}

interface ICrossbowmanBuilder extends IBuilder<Crossbowman> {
  setCrossbow(crossbow: Crossbow): void;
  setQuiverCapacity(capacity: number): void;
}

interface ISpearmanBuilder extends IBuilder<Spearman> {
  setSpear(spear: Spear): void;
}

interface IKnightBuilder extends IBuilder<Knight> {
  setSpear(spear: Spear): void;
  setHorse(horse: Horse): void;
}

export class SwordsmanBuilder implements ISwordsmanBuilder {
  private _sword?: Sword;

  getResult(): Swordsman {
    if (!this._sword) {
      throw new Error("No sword provided");
    }
    return new Swordsman(this._sword);
  }

  reset(): void {
    this._sword = undefined;
  }

  setSword(sword: Sword): void {
    this._sword = sword;
  }
}

export class SwordsmanDirector {
  constructor(private _builder: ISwordsmanBuilder) {}

  build(): void {
    this._builder.reset();
    this._builder.setSword(new Sword(true));
  }
}

export class ArcherBuilder implements IArcherBuilder {
  private _bow?: Bow;
  private _quiverCapacity: number = 30;

  getResult(): Archer {
    if (!this._bow) {
      throw new Error("No bow provided");
    }
    return new Archer(this._bow, this._quiverCapacity);
  }

  reset(): void {
    this._bow = undefined;
    this._quiverCapacity = 30;
  }

  setBow(bow: Bow): void {
    this._bow = bow;
  }

  setQuiverCapacity(capacity: number): void {
    this._quiverCapacity = capacity;
  }
}

export class ArcherDirector {
  constructor(private _builder: ArcherBuilder) {}

  build() {
    this._builder.reset();
    this._builder.setBow(new Bow());
    this._builder.setQuiverCapacity(40);
  }
}

export class CrossbowmanBuilder implements ICrossbowmanBuilder {
  private _crossbow?: Crossbow;
  private _quiverCapacity: number = 20;

  getResult(): Crossbowman {
    if (!this._crossbow) {
      throw new Error("No crossbow provided");
    }
    return new Crossbowman(this._crossbow, this._quiverCapacity);
  }

  reset(): void {
    this._crossbow = undefined;
    this._quiverCapacity = 20;
  }

  setCrossbow(crossbow: Crossbow): void {
    this._crossbow = crossbow;
  }

  setQuiverCapacity(capacity: number): void {
    this._quiverCapacity = capacity;
  }
}

export class CrossbowmanDirector {
  constructor(private _builder: CrossbowmanBuilder) {}

  build() {
    this._builder.reset();
    this._builder.setCrossbow(new Crossbow());
    this._builder.setQuiverCapacity(25);
  }
}

export class SpearmanBuilder implements ISpearmanBuilder {
  private _spear?: Spear;

  getResult(): Spearman {
    if (!this._spear) {
      throw new Error("No spear provided");
    }
    return new Spearman(this._spear);
  }

  reset(): void {
    this._spear = undefined;
  }

  setSpear(spear: Spear): void {
    this._spear = spear;
  }
}

export class SpearmanDirector {
  constructor(private _builder: SpearmanBuilder) {}

  build() {
    this._builder.reset();
    this._builder.setSpear(new Spear())
  }
}

export class KnightBuilder implements IKnightBuilder {
  private _spear?: Spear;
  private _horse?: Horse;

  getResult(): Knight {
    if (!this._spear || !this._horse) {
      throw new Error("Knight needs horse and spear");
    }
    return new Knight(this._spear, this._horse);
  }

  reset(): void {
    this._spear = undefined;
    this._horse = undefined;
  }

  setHorse(horse: Horse): void {
    this._horse = horse;
  }

  setSpear(spear: Spear): void {
    this._spear = spear;
  }
}

export class KnightDirector {
  constructor(private _builder: KnightBuilder) {}

  build() {
    this._builder.reset();
    this._builder.setSpear(new Spear());
    this._builder.setHorse(new Horse(40));
  }
}

interface IWarriorFactory {
  createSwordsman(): IWarrior;
  createArcher(): IWarrior;
  createCrossbowman(): IWarrior;
  createSpearman(): IWarrior;
  createKnight(): IWarrior;
}

export class WarriorFactory implements IWarriorFactory {
  private static _instance?: WarriorFactory;
  public static getInstance(): WarriorFactory {
    if (!this._instance) {
      this._instance = new WarriorFactory();
    }

    return this._instance;
  }

  private constructor() {}

  createSwordsman() {
    const builder = new SwordsmanBuilder();
    const director = new SwordsmanDirector(builder);

    director.build();

    return builder.getResult();
  }

  createArcher() {
    const builder = new ArcherBuilder();
    const director = new ArcherDirector(builder);

    director.build();

    return builder.getResult();
  }

  createCrossbowman() {
    const builder = new CrossbowmanBuilder();
    const director = new CrossbowmanDirector(builder);

    director.build();

    return builder.getResult();
  }

  createSpearman() {
    const builder = new SpearmanBuilder();
    const director = new SpearmanDirector(builder);

    director.build();

    return builder.getResult();
  }

  createKnight() {
    const builder = new KnightBuilder();
    const director = new KnightDirector(builder);

    director.build();

    return builder.getResult();
  }
}

function about() {
  console.log(`
  ФИО: Дедела Артур Саулюсович
  Группа: 8-3ТО-402Б-16
  Задание:
  Реализовать приложение, предоставляющее фабрику по производству
  продукции (вид продукции – на свой выбор, не менее 5 вариантов; классы
  конкретных продуктов должны реализовывать паттерн “мост”). Продукты
  должны выпускаться “абстрактной фабрикой”, являющейся “одиночкой”.
  Созданием объектов на фабрике занимается паттерн “строитель”,
  реализованный через паттерн “мост” (“директор” является абстракцией, а
  “строители” – реализациями). Продемонстрировать работу фабрики.
  `)
}

function Main() {
  about();

  const factory = WarriorFactory.getInstance();
  const warriors: IWarrior[] = [];

  for (let i = 0; i < 3; i++) {
    warriors.push(
      factory.createSwordsman(),
      factory.createArcher(),
      factory.createCrossbowman(),
      factory.createKnight(),
      factory.createSpearman(),
    )
  }

  warriors.sort(() => Math.random() - 0.5);

  const fightInterval = setInterval(() => {
    const i = Math.round((Math.random() * (warriors.length - 1)));
    const j = Math.round((Math.random() * (warriors.length - 1)));
    warriors[i].attack(warriors[j]);
  }, 500);

  setTimeout(() => {
    clearInterval(fightInterval);
  }, 5000);
}

Main();
