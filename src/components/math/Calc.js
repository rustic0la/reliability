import React from 'react';

class Calculator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			purpose: 'конкретное',
			recovery: 'восст',
			techService: 'обслуживаемые',
			applicationMode: 'ндп',
			output: '',
		};
	}

	async changeInputDropdown(id) {
		const e = document.getElementById(id);
		const val = e.value;
		await this.setState({ [id]: val });
	}

	async handleClick() {
		const {
			purpose,
			recovery,
			techService,
			applicationMode,
			output,
		} = this.state;

		let param;
		switch (recovery) {
			case 'восст':
				if (techService === 'обслуживаемые') {
					switch (purpose) {
						case 'конкретное':
							param =
								applicationMode === 'ндп'
									? 'Кг, Кти, То, Тв,'
									: applicationMode === 'мцп'
									? 'Kг*Р(tбр), Тв,'
									: 'Ктиож, Р(tбр), Твож,';
							await this.setState({ output: `${output} ${param}` });
							break;
						default:
							param =
								applicationMode === 'ндп' || applicationMode === 'мцп'
									? 'Кти, То, Тв'
									: '';
							await this.setState({ output: `${output} ${param}` });
							break;
					}
				} else {
					switch (purpose) {
						case 'конкретное':
							param =
								applicationMode === 'ндп'
									? 'Кг, То, Тв,'
									: applicationMode === 'мцп'
									? 'Kг*Р(tбр), Тв,'
									: 'Кгож, Р(tбр), Твож,';
							await this.setState({ output: `${output} ${param}` });
							break;
						default:
							param =
								applicationMode === 'ндп' || applicationMode === 'мцп'
									? 'Кг, То, Тв,'
									: '';
							await this.setState({ output: `${output} ${param}` });
							break;
					}
				}
				break;
			default:
				switch (purpose) {
					case 'конкретное':
						param =
							applicationMode === 'ндп'
								? 'Р(tбр) или Тср'
								: applicationMode === 'мцп'
								? 'Р0(вкл), Тср'
								: 'Р(tож), Р(tбр)';
						await this.setState({ output: `${output} ${param}` });
						break;
					default:
						param =
							applicationMode === 'ндп' || applicationMode === 'мцп'
								? 'Ту, Тср, Р0(вкл)'
								: '';
						await this.setState({ output: `${output} ${param}` });
						break;
				}
		}
	}

	render() {
		return (
			<>
				<div className="form-group">
					<div className="form-item">
						Назначение:
						<br />
						<form>
							<fieldset
								id="purpose"
								onChange={async () => await this.changeInputDropdown('purpose')}
							>
								<span className="form-item-variant">
									<input type="radio" value="конкретное" name="purpose" />
									<label htmlFor="конкретное">Конкретное</label>
								</span>
								<span className="form-item-variant">
									<input type="radio" value="общее" name="purpose" />
									<label htmlFor="общее">Общее</label>
								</span>
							</fieldset>
						</form>
					</div>

					<div className="form-item">
						Восстановление работоспособного состояния после отказа:
						<br />
						<form>
							<fieldset
								id="recovery"
								onChange={async () =>
									await this.changeInputDropdown('recovery')
								}
							>
								<span className="form-item-variant">
									<input type="radio" value="восст" name="recovery" />
									<label htmlFor="восст">Восстанавливаемые</label>
								</span>
								<span className="form-item-variant">
									<input type="radio" value="невосст" name="recovery" />
									<label htmlFor="невосст">Невосстанавливаемые</label>
								</span>
							</fieldset>
						</form>
					</div>

					<div className="form-item">
						Техническое обслуживание в процессе эксплуатации:
						<br />
						<form>
							<fieldset
								id="techService"
								onChange={async () =>
									await this.changeInputDropdown('techService')
								}
							>
								<span className="form-item-variant">
									<input
										type="radio"
										value="обслуживаемые"
										name="techService"
									/>
									<label htmlFor="обслуживаемые">Обслуживаемые</label>
								</span>
								<span className="form-item-variant">
									<input
										type="radio"
										value="необслуживаемые"
										name="techService"
									/>
									<label htmlFor="необслуживаемые">Необслуживаемые</label>
								</span>
							</fieldset>
						</form>
					</div>

					<div className="form-item">
						Режим применения (функционирования):
						<br />
						<select
							className="form-control"
							id="applicationMode"
							onChange={() => this.changeInputDropdown('applicationMode')}
						>
							<option value="ндп" key={7}>
								непрерывное длительное применение
							</option>
							<option value="мцп" key={8}>
								многократное циклическое применение
							</option>
							<option value="оп" key={9}>
								однократное применение
							</option>
						</select>
					</div>
				</div>
				<div className="result">
					<button
						className="result-button"
						onClick={async () => await this.handleClick()}
					>
						Рассчитать
					</button>
					<input
						type="text"
						className="output"
						placeholder="result"
						disabled
						value={this.state.output}
					/>
				</div>
			</>
		);
	}
}

export default Calculator;
