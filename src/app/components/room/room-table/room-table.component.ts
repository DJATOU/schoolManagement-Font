import { Component, OnInit } from '@angular/core';
import { Room } from '../../../models/room/room';
import { RoomService } from '../../../services/room.service';
import { ReusableDatatableComponent } from '../../shared/reusable-datatable/reusable-datatable.component';

@Component({
  selector: 'app-Room-table',
  standalone: true,
  imports: [ReusableDatatableComponent],
  templateUrl: './room-table.component.html',
  styleUrl: './room-table.component.scss'
})
export class RoomTableComponent implements OnInit {
  rooms: Room[] = [];
  columns = [
    {
      columnDef: 'id',
      header: 'ID',
      cell: (element: Room) => `${element.id}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: Room) => `${element.name}`,
    },
    {
      columnDef: 'capacity',
      header: 'Capacity',
      cell: (element: Room) => `${element.capacity}`,
    },
    {
      columnDef: 'description',
      header: 'Description',
      cell: (element: Room) => `${element.description}`,
    },
  ];

  roomService: RoomService;

  ngOnInit(): void {
    this.roomService.getRooms().subscribe((rooms: Room[]) => {
      this.rooms = rooms;
      console.log('Received rooms:', this.rooms);
    });
  }
  constructor(roomService: RoomService) {
    this.roomService = roomService;
  }
}
