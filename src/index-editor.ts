import { LitElement, html, customElement, TemplateResult, CSSResult, property } from 'lit-element';
import { HomeAssistant, fireEvent, LovelaceCardEditor, ActionConfig } from 'custom-card-helpers';
import { localize } from './localize/localize';
import { style } from './style-editor';
import { atomicCardConfig } from './types';
import { EDITOR_VERSION } from './const';

var linkTargets: string[] = ["_blank", "_self", "_parent", "_top"];

const options = {
	required: {
		icon: 'tune',
		show: true
	},
	main: {
		icon: 'eye-settings',
		show: false
	},
	event: {
		icon: 'calendar-check',
		show: false
	},
	calendar: {
		icon: 'calendar-month-outline',
		show: false
	},
	appearance: {
		icon: 'palette',
		show: false,
		options: {
			main: {
				icon: 'eye-settings',
				show: false
			}

		}
	}

};

@customElement('atomic-calendar-revive-editor')
export class AtomicCalendarReviveEditor extends LitElement implements LovelaceCardEditor {
	@property() public hass?: HomeAssistant;
	@property() private _config?: atomicCardConfig;
	@property() private _toggle?: boolean;

	static get styles(): CSSResult {
		return style;
	}

	public setConfig(config: atomicCardConfig): void {
		this._config = config;
	}

	get _entity(): string {
		if (this._config) {
			return this._config.entity || '';
		}

		return '';
	}

	//MAIN SETTINGS
	get _name(): string {
		if (this._config) {
			return this._config.name || '';
		}
		return '';
	}

	get _showColors(): boolean {
		if (this._config) {
			return this._config.showColors || true;
		}

		return false;
	}

	get _maxDaysToShow(): number {
		if (this._config) {
			return this._config.maxDaysToShow || 7;
		}
		return 7;
	}

	get _linkTarget(): string {
		if (this._config) {
			return this._config.linkTarget || '_blank';
		}
		return '_blank';
	}

	get _showLocation(): boolean {
		if (this._config) {
			return this._config.showLocation || true;
		}
		return false;
	}
	get _showLoader(): boolean {
		if (this._config) {
			return this._config.showLoader || true;
		}
		return false;
	}
	get _sortByStartTime(): boolean {
		if (this._config) {
			return this._config.sortByStartTime || false;
		}
		return true;
	}
	get _showDeclined(): boolean {
    if (this._config) {
      return this._config.showDeclined || false;
    }
    return false;
  }
	// MAIN SETTINGS END

	// EVENT SETTINGS

	get _showCurrentEventLine(): boolean {
		if (this._config) {
			return this._config.showCurrentEventLine || false;
		}
		return true;
	}

	get _showProgressBar(): boolean {
		if (this._config) {
			return this._config.showProgressBar || true;
		}
		return false;
	}

	get _showMonth(): boolean {
		if (this._config) {
			return this._config.showMonth || false;
		}
		return true;
	}
	get _showWeekDay(): boolean {
		if (this._config) {
			return this._config.showWeekDay || false;
		}
		return true;
	}
	get _showDescription(): boolean {
		if (this._config) {
			return this._config.showDescription || true;
		}
		return false;
	}
	get _disableEventLink(): boolean {
		if (this._config) {
			return this._config.disableEventLink || false;
		}
		return true;
	}
	get _disableLocationLink(): boolean {
		if (this._config) {
			return this._config.disableLocationLink || false;
		}
		return true;
	}
	get _showNoEventsForToday(): boolean {
		if (this._config) {
			return this._config.showNoEventsForToday || false;
		}
		return true;
	}
	get _showCalNameInEvent(): boolean {
		if (this._config) {
			return this._config.showCalNameInEvent || false;
		}
		return true;
	}
	get _showFullDayProgress(): boolean {
		if (this._config) {
			return this._config.showFullDayProgress || false;
		}
		return true;
	}
	get _hideFinishedEvents(): boolean {
		if (this._config) {
			return this._config.hideFinishedEvents || false;
		}
		return true;
	}
	get _untilText(): string {
		if (this._config) {
			return this._config.untilText || '';
		}
		return '';
	}
	get _fullDayEventText(): string {
		if (this._config) {
			return this._config.fullDayEventText || '';
		}
		return '';
	}
	get _noEventsForNextDaysText(): string {
		if (this._config) {
			return this._config.noEventsForNextDaysText || '';
		}
		return '';
	}
	get _noEventsForTodayText(): string {
		if (this._config) {
			return this._config.noEventsForTodayText || '';
		}
		return '';
	}
	// EVENT SETTINGS END

	// CALENDAR SETTINGS

	get _showDate(): boolean {
		if (this._config) {
			return this._config.showDate || false;
		}

		return true;
	}

	// CALENDAR SETTINGS END

	// APPEARENCE SETTINGS

	get _locationLinkColor(): string {
		if (this._config) {
			return this._config.locationLinkColor || '';
		}
		return '';
	}
	get _dimFinishedEvents(): boolean {
		if (this._config) {
			return this._config.dimFinishedEvents || true;
		}
		return false;
	}


	// APPEARENCE SETTINGS END


	protected render(): TemplateResult | void {
		if (!this.hass) {
			return html``;
		}

		// You can restrict on domain type
		const entities = Object.keys(this.hass.states).filter(eid => eid.substr(0, eid.indexOf('.')) === 'sun');

		return html`
			<div class="card-config">
				<div class="option" @click=${this._toggleOption} .option=${'required'}>
					<div class="row">
						<ha-icon .icon=${`mdi:${options.required.icon}`}></ha-icon>
						<div class="title">${localize('required.name')}</div>
					</div>
					<div class="secondary">${localize('required.secondary')}</div>
				</div>
				${options.required.show
				? html`
							<div class="values">
								<paper-dropdown-menu
									label="Entity (Required)"
									@value-changed=${this._valueChanged}
									.configValue=${'entity'}
								>
									<paper-listbox slot="dropdown-content" .selected=${entities.indexOf(this._entity)}>
										${entities.map(entity => {
					return html`
												<paper-item>${entity}</paper-item>
											`;
				})}
									</paper-listbox>
								</paper-dropdown-menu>
							</div>
						`
			: ''}
				<!-- MAIN SETTINGS -->
				<div class="option" @click=${this._toggleOption} .option=${'main'}>
					<div class="row">
						<ha-icon .icon=${`mdi:${options.main.icon}`}></ha-icon>
						<div class="title">${localize('main.name')}</div>
					</div>
					<div class="secondary">${localize('main.secondary')}</div>
				</div>
				${options.main.show
				? html`
							<div class="values">
								<paper-input
									label="${localize('main.fields.name')}"
									.value=${this._name}
									.configValue=${'name'}
									@value-changed=${this._valueChanged}
								></paper-input>
								<br />
								<ha-switch
									aria-label=${`Toggle colors ${this._showColors ? 'on' : 'off'}`}
									.checked=${this._showColors !== false}
									.configValue=${'showColors'}
									@change=${this._valueChanged}
									>${localize('main.fields.showColors')}</ha-switch
								>
								<paper-input
									label="${localize('main.fields.maxDaysToShow')}"
									type="number"
									.value=${this._maxDaysToShow}
									.configValue=${'maxDaysToShow'}
									@value-changed=${this._valueChanged}
								></paper-input>
								<ha-switch
									aria-label=${`Toggle ${this._showLocation ? 'on' : 'off'}`}
									.checked=${this._showLocation !== false}
									.configValue=${'showLocation'}
									@change=${this._valueChanged}
									>${localize('main.fields.showLocation')}</ha-switch
								>
								<ha-switch
									aria-label=${`Toggle ${this._showLoader ? 'on' : 'off'}`}
									.checked=${this._showLoader !== false}
									.configValue=${'showLoader'}
									@change=${this._valueChanged}
									>${localize('main.fields.showLoader')}</ha-switch
								>
								<ha-switch
									aria-label=${`Toggle ${this._showDate ? 'off' : 'on'}`}
									.checked=${this._showDate !== false}
									.configValue=${'showDate'}
									@change=${this._valueChanged}
									>${localize('main.fields.showDate')}</ha-switch
								>
								<ha-switch
          				aria-label=${`Toggle Show Declined ${this._showDeclined ? 'off' : 'on'}`}
          				.checked=${this._showDeclined !== false}
          				.configValue=${'showDeclined'}
          				@change=${this._valueChanged}
          				>${localize('main.fields.showDeclined')}</ha-switch
          			>
								<ha-switch
									aria-label=${`Toggle ${this._sortByStartTime ? 'off' : 'on'}`}
									.checked=${this._sortByStartTime !== false}
									.configValue=${'sortByStartTime'}
									@change=${this._valueChanged}
									>${localize('main.fields.sortByStartTime')}</ha-switch
								>
								<ha-switch
									aria-label=${`Toggle ${this._hideFinishedEvents ? 'on' : 'off'}`}
									.checked=${this._hideFinishedEvents !== false}
									.configValue=${'hideFinishedEvents'}
									@change=${this._valueChanged}
									>${localize('main.fields.hideFinishedEvents')}</ha-switch
								>
								<paper-dropdown-menu
									label="${localize('main.fields.link_target')}"
									@value-changed=${this._valueChanged}
									.configValue=${'linkTarget'}
									>
									<paper-listbox slot="dropdown-content" .selected=${linkTargets.indexOf(this._linkTarget)}>
								 		${linkTargets.map(linkTarget => {
											return html`
												<paper-item>${linkTarget}</paper-item>
											`;})}
									</paper-listbox>
								</paper-dropdown-menu>
							</div>
						`
			: ''}
				<!-- MAIN SETTINGS END -->
				<!-- EVENT SETTINGS -->
				<div class="option" @click=${this._toggleOption} .option=${'event'}>
					<div class="row">
						<ha-icon .icon=${`mdi:${options.event.icon}`}></ha-icon>
						<div class="title">${localize('event.name')}</div>
					</div>
					<div class="secondary">${localize('event.secondary')}</div>
				</div>
				${options.event.show
				? html`
								<ha-switch
									aria-label=${`Toggle ${this._showCurrentEventLine ? 'off' : 'on'}`}
									.checked=${this._showCurrentEventLine !== false}
									.configValue=${'showCurrentEventLine'}
									@change=${this._valueChanged}
									>${localize('event.fields.showCurrentEventLine')}</ha-switch
								>
								<ha-switch
									aria-label=${`Toggle ${this._showProgressBar ? 'on' : 'off'}`}
									.checked=${this._showProgressBar !== false}
									.configValue=${'showProgressBar'}
									@change=${this._valueChanged}
									>${localize('event.fields.showProgressBar')}</ha-switch
								>
								<ha-switch
									aria-label=${`Toggle ${this._showMonth ? 'off' : 'on'}`}
									.checked=${this._showMonth !== false}
									.configValue=${'showMonth'}
									@change=${this._valueChanged}
									>${localize('event.fields.showMonth')}</ha-switch
								>
								<ha-switch
									aria-label=${`Toggle ${this._showWeekDay ? 'off' : 'on'}`}
									.checked=${this._showWeekDay !== false}
									.configValue=${'showWeekDay'}
									@change=${this._valueChanged}
									>${localize('event.fields.showWeekDay')}</ha-switch
								>
								<ha-switch
									aria-label=${`Toggle ${this._showDescription ? 'on' : 'off'}`}
									.checked=${this._showDescription !== false}
									.configValue=${'showDescription'}
									@change=${this._valueChanged}
									>${localize('event.fields.showDescription')}</ha-switch
								>
								<ha-switch
									aria-label=${`Toggle ${this._disableEventLink ? 'off' : 'on'}`}
									.checked=${this._disableEventLink !== false}
									.configValue=${'disableEventLink'}
									@change=${this._valueChanged}
									>${localize('event.fields.disableEventLink')}</ha-switch
								>
								<ha-switch
									aria-label=${`Toggle ${this._disableLocationLink ? 'off' : 'on'}`}
									.checked=${this._disableLocationLink !== false}
									.configValue=${'disableLocationLink'}
									@change=${this._valueChanged}
									>${localize('event.fields.disableLocationLink')}</ha-switch
								>
								<ha-switch
									aria-label=${`Toggle ${this._showNoEventsForToday ? 'off' : 'on'}`}
									.checked=${this._showNoEventsForToday !== false}
									.configValue=${'showNoEventsForToday'}
									@change=${this._valueChanged}
									>${localize('event.fields.showNoEventsForToday')}</ha-switch
								>
								<ha-switch
									aria-label=${`Toggle ${this._showFullDayProgress ? 'off' : 'on'}`}
									.checked=${this._showFullDayProgress !== false}
									.configValue=${'showFullDayProgress'}
									@change=${this._valueChanged}
									>${localize('event.fields.showFullDayProgress')}</ha-switch
								>
								<paper-input
									label="${localize('event.fields.untilText')}"
									type="text"
									.value=${this._untilText}
									.configValue=${'untilText'}
									@value-changed=${this._valueChanged}
								></paper-input>
								<paper-input
									label="${localize('event.fields.fullDayEventText')}"
									type="text"
									.value=${this._fullDayEventText}
									.configValue=${'fullDayEventText'}
									@value-changed=${this._valueChanged}
								></paper-input>
								<paper-input
									label="${localize('event.fields.noEventsForNextDaysText')}"
									type="text"
									.value=${this._noEventsForNextDaysText}
									.configValue=${'noEventsForNextDaysText'}
									@value-changed=${this._valueChanged}
								></paper-input>
								<paper-input
									label="${localize('event.fields.noEventsForTodayText')}"
									type="text"
									.value=${this._noEventsForTodayText}
									.configValue=${'noEventsForTodayText'}
									@value-changed=${this._valueChanged}
								></paper-input>
							</div>
						`
			: ''}
				<!-- EVENT SETTINGS END -->
				<!-- CALENDAR SETTINGS -->
				<div class="option" @click=${this._toggleOption} .option=${'calendar'}>
					<div class="row">
						<ha-icon .icon=${`mdi:${options.calendar.icon}`}></ha-icon>
						<div class="title">${localize('calendar.name')}</div>
					</div>
					<div class="secondary">${localize('calendar.secondary')}</div>
				</div>
				${options.calendar.show
				? html`
						`
			: ''}
				<!-- CALENDAR SETTINGS END -->
				<!-- APPEARANCE SETTINGS -->
				<div class="option" @click=${this._toggleOption} .option=${'appearance'}>
					<div class="row">
						<ha-icon .icon=${`mdi:${options.appearance.icon}`}></ha-icon>
						<div class="title">${localize('appearance.name')}</div>
					</div>
					<div class="secondary">${localize('appearance.secondary')}</div>
				</div>
				${options.appearance.show
			? html`
				<div class="values"><div class="values">
          <div class="option" @click=${this._toggleAppearance} .option=${'main'}>
            <div class="row">
              <ha-icon .icon=${`mdi:${options.appearance.options.main.icon}`}></ha-icon>
              <div class="title">${localize('appearance.main.name')}</div>
            </div>
        		<div class="secondary">${localize('appearance.main.secondary')}</div>
          </div>
					${options.appearance.options.main.show
            ? html`
              <div class="values">
								<paper-input
									label="${localize('appearance.fields.locationLinkColor')}"
									.value=${this._locationLinkColor}
									.configValue=${'locationLinkColor'}
									@value-changed=${this._valueChanged}
								></paper-input>
								<ha-switch
									aria-label=${`Toggle ${this._dimFinishedEvents ? 'off' : 'on'}`}
									.checked=${this._dimFinishedEvents !== false}
									.configValue=${'dimFinishedEvents'}
									@change=${this._valueChanged}
									>${localize('appearance.fields.dimFinishedEvents')}</ha-switch
								>

              </div>
            `
            : ''}
					</div>
				`
				: ''}
				<!-- APPEARANCE SETTINGS END -->
			</div>
		`;
	}

	private _toggleAppearance(ev): void {
		this._toggleThing(ev, options.appearance.options);
	}

	private _toggleOption(ev): void {
		this._toggleThing(ev, options);
	}

	private _toggleThing(ev, optionList): void {
		const show = !optionList[ev.target.option].show;
		for (const [key] of Object.entries(optionList)) {
			optionList[key].show = false;
		}
		optionList[ev.target.option].show = show;
		this._toggle = !this._toggle;
	}

	private _valueChanged(ev): void {
		if (!this._config || !this.hass) {
			return;
		}
		const target = ev.target;
		if (this[`_${target.configValue}`] === target.value) {
			return;
		}
		if (target.configValue) {
			if (target.value === '') {
				delete this._config[target.configValue];
			} else {
				this._config = {
					...this._config,
					[target.configValue]: target.checked !== undefined ? target.checked : target.value,
				};
			}
		}
		fireEvent(this, 'config-changed', { config: this._config });
	}
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
	type: 'atomic-calendar-revive',
	name: 'Atomic Calendar Revive',
	description: localize('common.description'),
});