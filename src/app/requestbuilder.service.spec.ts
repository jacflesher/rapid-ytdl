import { TestBed } from '@angular/core/testing';

import { RequestbuilderService } from './requestbuilder.service';

describe('RequestbuilderService', () => {
  let service: RequestbuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestbuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
