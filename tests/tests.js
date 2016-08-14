/**
 * Created by noelbillig on 7/9/16.
 */
QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!" );
});


QUnit.test('distance', function (assert) {
    assert.deepEqual(   GeomUtil.distance(), NaN, 'No parameters' );
    assert.strictEqual( GeomUtil.distance(0,0), 0, 'Zero' );
    assert.strictEqual( GeomUtil.distance(23,6), 23.769728648009426, 'Positive' );
    assert.strictEqual( GeomUtil.distance(-32,-13), 34.539832078341085, 'Negative' );
    assert.strictEqual( GeomUtil.distance(.56,.23), 0.6053924347066125, 'Decimal' );
});
