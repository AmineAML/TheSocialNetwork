import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs'
import { startWith, map } from 'rxjs/operators'

export interface Interest {
    name: string
}

@Component({
    selector: 'app-hero',
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
    @Output() getUsers = new EventEmitter<string>()
    @Input() options: Interest[]

    myControl = new FormControl()

    filteredOptions: Observable<Interest[]>

    constructor() {}

    searchUsersWithHobby(value: string) {
        if (value && value.trim()) {
            this.getUsers.emit(value)
        }
    }

    ngOnInit() {
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => (typeof value === 'string' ? value : value.name)),
            map(name => (name ? this.filter(name) : this.options.slice()))
        )
    }

    private filter(name: string): Interest[] {
        const filterValue = name.toLowerCase()

        return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
    }
}
